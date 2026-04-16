import { Transform } from 'node:stream';
import path from 'node:path/posix';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MultipartFile } from '@fastify/multipart';
import { UserTokenDataDto } from '../auth/entities/user-token-data.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserDataDto } from './entities/user-data.js';
import { S3Service } from '../s3/s3.service.js';
import {
  USER_AVATAR_UPLOAD_MAX_SIZE,
  USER_AVATAR_UPLOAD_MIME_TYPES,
} from './schemas/user-avatar-upload.schema.js';

import { UserAvatarUploadResponseDto } from './entities/user-avatar-upload.js';
import { UserUpdateDataDto } from './entities/user-update-data.js';
import {
  UserDataListDto,
  UserDataListQueryDto,
} from './entities/user-data-list.js';
import { UserPartialDataDto } from './entities/user-partial-data.js';
import { StaticService } from '../static/static.service.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly staticService: StaticService,
  ) {}

  async retrieveAll(query: UserDataListQueryDto): Promise<UserDataListDto> {
    // Get users with pagination and optional search on username
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        profilePicture: true,
      },
      where: {
        username: query.search
          ? { contains: query.search, mode: 'insensitive' }
          : undefined,
      },
      skip: query.skip,
      take: query.limit,
    });

    return {
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        profilePicture: user.profilePicture,
      })),
      total: await this.prismaService.user.count({
        where: {
          username: query.search
            ? { contains: query.search, mode: 'insensitive' }
            : undefined,
        },
      }),
    };
  }

  async retrieveById(userId: string): Promise<UserPartialDataDto> {
    const user = await this.prismaService.user.findFirst({
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        profilePicture: true,
      },
      where: {
        id: userId,
      },
    });
    if (null === user) throw new NotFoundException();

    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      profilePicture: user.profilePicture,
    };
  }

  async retrieveMe(token: UserTokenDataDto): Promise<UserDataDto> {
    const user = await this.prismaService.user.findFirst({
      select: {
        id: true,
        email: true,
        username: true,
        firstname: true,
        lastname: true,
        phoneNumber: true,
        profilePicture: true,
        createdAt: true,
      },
      where: {
        id: token.id,
      },
    });
    if (null === user) {
      throw new NotFoundException();
    }
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async updateMe(
    token: UserTokenDataDto,
    data: UserUpdateDataDto,
  ): Promise<UserDataDto> {
    //Verify that at least one field is being updated
    if (
      Object.keys(data).length === 0 ||
      (null === data.email &&
        null === data.firstname &&
        null === data.lastname &&
        null === data.phoneNumber)
    ) {
      throw new BadRequestException('At least one field is expected');
    }

    const user = await this.prismaService.user.update({
      where: {
        id: token.id,
      },
      data: {
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        phoneNumber: data.phoneNumber,
      },
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async deleteMe(token: UserTokenDataDto): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: token.id,
      },
      select: {
        profilePicture: true,
      },
    });

    if (null === user) throw new NotFoundException();

    if (user.profilePicture) {
      const url = new URL(user.profilePicture);
      const filename = url.pathname.substring('/static/avatars/'.length);
      const key = path.join('avatars', token.id, filename);
      await this.s3Service.delete(this.staticService.getBucket(), key);
    }

    const posts = await this.prismaService.post.findMany({
      where: {
        userId: token.id,
      },
      select: {
        id: true,
        image: true,
      },
    });

    for (const post of posts) {
      if (post.image) {
        const url = new URL(post.image);
        const key = url.pathname.substring('/static/images/'.length);
        await this.s3Service.delete('images', key);
      }
    }

    await this.prismaService.post.deleteMany({
      where: {
        userId: token.id,
      },
    });

    await this.prismaService.user.delete({
      where: {
        id: token.id,
      },
    });
  }

  async uploadAvatar(
    token: UserTokenDataDto,
    file: MultipartFile,
  ): Promise<UserAvatarUploadResponseDto> {
    if (!USER_AVATAR_UPLOAD_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid mime type');
    }

    let totalSize = 0;
    const sizeValidator = new Transform({
      transform(chunk: Buffer, _encoding: string, callback) {
        totalSize += chunk.length;
        if (totalSize > USER_AVATAR_UPLOAD_MAX_SIZE) {
          return callback(new BadRequestException('File too large'));
        }
        callback(null, chunk);
      },
    });
    const uploadStream = file.file.pipe(sizeValidator);

    const sanitizedFilename = S3Service.sanitizeFilename(file.filename);
    const key = path.join('avatars', token.id, sanitizedFilename);
    await this.s3Service.pushMultipart(
      this.staticService.getBucket(),
      key,
      uploadStream,
      file.mimetype,
    );

    const staticAvatarUrl = `${this.staticService.getStaticOrigin()}/static/${key}`;
    await this.prismaService.user.update({
      where: {
        id: token.id,
      },
      data: {
        profilePicture: staticAvatarUrl,
      },
    });

    return { avatarUrl: staticAvatarUrl };
  }
}
