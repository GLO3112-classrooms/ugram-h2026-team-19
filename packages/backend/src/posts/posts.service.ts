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
import { UserTokenData } from '../index.schema.js';
import { GetPostsQuery } from './schemas/get-posts-list.schema.js';
import { PostDataList } from './schemas/post-data-list.schema.js';
import { PostUpdateDto } from './dto/update-post.dto.js';
import { StaticService } from '../static/static.service.js';
import { PostWhereInput } from '../prisma/generated/models/Post.js';
import { PostCommentCreateDto } from './dto/create-post-comment.dto.js';
import { PostCommentDto } from './entities/post-comment.js';
import { KeywordDataDto } from './entities/keyword-data.js';

// Reusable select shape for both get and list
const POST_SELECT = {
  id: true,
  description: true,
  image: true,
  createdAt: true,
  keywords: {
    select: { value: true },
  },
  mentions: {
    select: {
      id: true,
      username: true,
      profilePicture: true,
    },
  },
  reactions: {
    select: {
      id: true,
      username: true,
      profilePicture: true,
    },
  },
  comments: {
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          profilePicture: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' as const },
  },
  user: {
    select: {
      id: true,
      username: true,
      profilePicture: true,
    },
  },
} as const;

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly staticService: StaticService,
  ) {}

  // ─── Keywords ────────────────────────────────────────────────────────────────

  async listKeywords(): Promise<KeywordDataDto[]> {
    const keywords = await this.prismaService.postKeyword.findMany({
      select: {
        value: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        posts: { _count: 'desc' },
      },
    });

    return keywords.map((k) => ({
      value: k.value,
      count: k._count.posts,
    }));
  }

  // ─── Posts ───────────────────────────────────────────────────────────────────

  async get(id: UUID) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      select: POST_SELECT,
    });

    if (null === post) {
      throw new NotFoundException();
    }

    return {
      ...post,
      createdAt: post.createdAt.toISOString(),
      comments: post.comments.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    };
  }

  async list(query: GetPostsQuery, fromUserID?: UUID): Promise<PostDataList> {
    const where: PostWhereInput = {
      ...(fromUserID ? { user: { id: fromUserID } } : {}),
      ...(query.description
        ? { description: { contains: query.description, mode: 'insensitive' } }
        : {}),
      ...(query.keywords
        ? {
            AND: query.keywords.split(',').map((keyword) => ({
              keywords: {
                some: {
                  value: { contains: keyword.trim(), mode: 'insensitive' },
                },
              },
            })),
          }
        : {}),
    };

    const [posts, total] = await this.prismaService.$transaction([
      this.prismaService.post.findMany({
        where,
        select: POST_SELECT,
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.post.count({ where }),
    ]);

    return {
      posts: posts.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        comments: p.comments.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        })),
      })),
      total,
    };
  }

  async create(
    token: UserTokenDataDto,
    dto: PostCreateDto,
  ): Promise<CreatedPostDto> {
    return this.prismaService.post.create({
      data: {
        user: { connect: { id: token.id } },
        description: dto.description,
        keywords: {
          connectOrCreate: dto.keywords.map((value) => ({
            where: { value },
            create: { value },
          })),
        },
        mentions: {
          connect: dto.mentions.map((id) => ({ id })),
        },
      },
      select: { id: true },
    });
  }

  async uploadImage(
    token: UserTokenData,
    postId: UUID,
    file: MultipartFile,
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

    const sanitizedFilename = S3Service.sanitizeFilename(file.filename);
    const key = path.join('images', token.id, sanitizedFilename);
    await this.s3Service.pushMultipart(
      this.staticService.getBucket(),
      key,
      uploadStream,
      file.mimetype,
    );

    const staticImageUrl = `${this.staticService.getStaticOrigin()}/static/${key}`;

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

  async patch(
    token: UserTokenData,
    id: UUID,
    body: PostUpdateDto,
  ): Promise<void> {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      select: { user: { select: { id: true } } },
    });

    if (null === post) {
      throw new NotFoundException();
    }

    if (token.id !== post.user.id) {
      throw new ForbiddenException();
    }

    await this.prismaService.post.update({
      where: { id, user: { id: token.id } },
      data: {
        ...(body.description ? { description: body.description } : {}),
        ...(body.keywords
          ? {
              keywords: {
                set: [],
                connectOrCreate: body.keywords.map((value) => ({
                  where: { value },
                  create: { value },
                })),
              },
            }
          : {}),
        ...(body.mentions
          ? {
              mentions: {
                set: body.mentions.map((id) => ({ id })),
              },
            }
          : {}),
      },
    });
  }

  async delete(token: UserTokenData, id: UUID): Promise<void> {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      select: {
        image: true,
        user: { select: { id: true } },
      },
    });

    if (null === post) {
      throw new NotFoundException();
    }

    if (token.id !== post.user.id) {
      throw new ForbiddenException();
    }

    if (post.image) {
      const url = new URL(post.image);
      const imageKey = url.pathname.substring('/static/images/'.length);
      await this.s3Service.delete('images', imageKey);
    }

    await this.prismaService.post.delete({
      where: { id, user: { id: token.id } },
    });
  }

  // ─── Reactions ───────────────────────────────────────────────────────────────

  async toggleReaction(token: UserTokenData, postId: UUID): Promise<void> {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: {
        reactions: { where: { id: token.id }, select: { id: true } },
      },
    });

    if (null === post) throw new NotFoundException();

    const alreadyLiked = post.reactions.length > 0;

    await this.prismaService.post.update({
      where: { id: postId },
      data: {
        reactions: {
          [alreadyLiked ? 'disconnect' : 'connect']: { id: token.id },
        },
      },
    });
  }

  // ─── Comments ────────────────────────────────────────────────────────────────

  async createComment(
    token: UserTokenData,
    postId: UUID,
    dto: PostCommentCreateDto,
  ): Promise<PostCommentDto> {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (null === post) throw new NotFoundException();

    const comment = await this.prismaService.postComment.create({
      data: {
        content: dto.content,
        post: { connect: { id: postId } },
        user: { connect: { id: token.id } },
      },
      select: {
        id: true,
        content: true,
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

    return { ...comment, createdAt: comment.createdAt.toISOString() };
  }

  async deleteComment(
    token: UserTokenData,
    postId: UUID,
    commentId: UUID,
  ): Promise<void> {
    const comment = await this.prismaService.postComment.findUnique({
      where: { id: commentId },
      select: {
        postId: true,
        user: { select: { id: true } },
      },
    });

    if (null === comment || comment.postId !== postId) {
      throw new NotFoundException();
    }

    if (token.id !== comment.user.id) {
      throw new ForbiddenException();
    }

    await this.prismaService.postComment.delete({ where: { id: commentId } });
  }
}
