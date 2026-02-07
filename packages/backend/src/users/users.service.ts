import { Injectable, NotFoundException } from '@nestjs/common';
import { UserTokenDataDto } from '../auth/entities/user-token-data.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserDataDto } from './entities/user-data.js';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
