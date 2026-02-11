import { Injectable, NotFoundException } from '@nestjs/common';
import { UserTokenDataDto } from '../auth/entities/user-token-data.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserDataDto } from './entities/user-data.js';
import { S3Service } from 'src/s3/s3.service.js';

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

  async uploadAvatar(token: UserTokenDataDto) {
    await this.s3Service.createBucket('avatars');
    await this.s3Service.push('avatars', `${token.id}/avatar.jpg`,)
    return await new Promise((resolve) => resolve(null));
  }
}
