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

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async retrieveMe(token: UserTokenDataDto): Promise<UserDataDto> {
    const user = await this.prismaService.user.findFirst({
      select: {
        id: true,
        email: true,
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
      firstname: user.firstname,
      lastname: user.lastname,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async uploadAvatar(
    token: UserTokenDataDto,
    file: MultipartFile,
    origin: string,
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

    await this.s3Service.createBucket('avatars');

    const filename = path.join(token.id, file.filename);
    await this.s3Service.pushMultipart(
      'avatars',
      filename,
      uploadStream,
      file.mimetype,
    );
    const staticAvatarUrl = `${origin}/static/avatars/${filename}`;

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
