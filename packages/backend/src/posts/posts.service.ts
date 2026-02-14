import { UUID } from 'node:crypto';
import { Transform } from 'node:stream';
import path from 'node:path/posix';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { S3Service } from '../s3/s3.service.js';
import { BadRequestException } from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import { UserTokenDataDto } from '../auth/entities/user-token-data.js';
import {
  POST_IMAGE_UPLOAD_MAX_SIZE,
  POST_IMAGE_UPLOAD_MIME_TYPES,
} from './schemas/post-image-upload.schema.js';
import { PostImageUploadResponseDto } from './entities/post-image-upload.js';
import { PostCreateDto } from './dto/create-post.dto.js';
import { CreatedPostDto } from './entities/created-post.js';
import { UserTokenData } from 'src/index.schema.js';
import { GetPostsQuery } from './schemas/get-posts-list.schema.js';
import { PostDataList } from './schemas/post-data-list.schema.js';

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async get(id: UUID) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        description: true,
        keywords: true,
        mentions: true,
        image: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    if (null === post) {
      throw new NotFoundException();
    }

    return {
      id: post.id,
      description: post.description,
      keywords: post.keywords,
      mentions: post.mentions,
      image: post.image,
      createdAt: post.createdAt.toISOString(),
      user: {
        id: post.user.id,
        username: post.user.username,
        profilePicture: post.user.profilePicture,
      },
    };
  }

  async list(query: GetPostsQuery): Promise<PostDataList> {
    const posts = await this.prismaService.post.findMany({
      select: {
        id: true,
        description: true,
        keywords: true,
        mentions: true,
        image: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      skip: query.skip,
      take: query.limit,
      orderBy: { createdAt: 'asc' },
    });

    const total = await this.prismaService.post.count();

    return {
      posts: posts.map((p) => ({
        id: p.id,
        description: p.description,
        keywords: p.keywords,
        mentions: p.mentions,
        image: p.image,
        createdAt: p.createdAt.toISOString(),
        user: {
          id: p.user.id,
          username: p.user.username,
          profilePicture: p.user.profilePicture,
        },
      })),
      total: total,
    };
  }

  async listUserPosts(
    userId: UUID,
    query: GetPostsQuery,
  ): Promise<PostDataList> {
    const posts = await this.prismaService.post.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        description: true,
        keywords: true,
        mentions: true,
        image: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
          },
        },
      },
      skip: query.skip,
      take: query.limit,
      orderBy: { createdAt: 'asc' },
    });

    const total = await this.prismaService.post.count({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return {
      posts: posts.map((p) => ({
        id: p.id,
        description: p.description,
        keywords: p.keywords,
        mentions: p.mentions,
        image: p.image,
        createdAt: p.createdAt.toISOString(),
        user: {
          id: p.user.id,
          username: p.user.username,
          profilePicture: p.user.profilePicture,
        },
      })),
      total: total,
    };
  }

  async create(
    token: UserTokenDataDto,
    dto: PostCreateDto,
  ): Promise<CreatedPostDto> {
    const post = await this.prismaService.post.create({
      data: {
        user: { connect: { id: token.id } },
        description: dto.description,
        keywords: dto.keywords,
        mentions: dto.mentions,
      },
      select: {
        id: true,
      },
    });

    return post;
  }

  async uploadImage(
    token: UserTokenData,
    postId: UUID,
    file: MultipartFile,
    origin: string,
  ): Promise<PostImageUploadResponseDto> {
    const postAuthor = await this.prismaService.post.findFirst({
      where: {
        id: postId,
      },
      select: {
        user: { select: { id: true } },
      },
    });

    if (null === postAuthor) {
      throw new NotFoundException();
    }

    if (token.id !== postAuthor.user.id) {
      throw new ForbiddenException();
    }

    if (!POST_IMAGE_UPLOAD_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid mime type');
    }

    let totalSize = 0;
    const sizeValidator = new Transform({
      transform(chunk: Buffer, _encoding: string, callback) {
        totalSize += chunk.length;
        if (totalSize > POST_IMAGE_UPLOAD_MAX_SIZE) {
          return callback(new BadRequestException('File too large'));
        }
        callback(null, chunk);
      },
    });
    const uploadStream = file.file.pipe(sizeValidator);

    await this.s3Service.createBucket('images');

    const filename = path.join(postId, file.filename);
    await this.s3Service.pushMultipart(
      'images',
      filename,
      uploadStream,
      file.mimetype,
    );
    const staticImageUrl = `${origin}/static/images/${filename}`;

    await this.prismaService.post.update({
      where: {
        id: postId,
      },
      data: {
        image: staticImageUrl,
      },
    });

    return { imageUrl: staticImageUrl };
  }

  async delete(token: UserTokenData, id: UUID): Promise<void> {
    const postAuthor = await this.prismaService.post.findUnique({
      where: {
        id: id,
      },
      select: {
        user: {
          select: { id: true },
        },
      },
    });
    if (null === postAuthor) {
      throw new NotFoundException();
    }

    if (token.id !== postAuthor.user.id) {
      throw new ForbiddenException();
    }

    await this.prismaService.post.delete({
      where: {
        id: id,
        user: {
          id: token.id,
        },
      },
    });
  }
}
