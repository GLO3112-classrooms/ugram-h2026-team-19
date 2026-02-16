import { randomBytes } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, argon2id, verify } from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthRegisterDto } from './dto/register.dto.js';
import { AuthLoginDto } from './dto/login.dto.js';
import { CreatedUserDto } from './entities/created-user.js';
import { JwtService } from '@nestjs/jwt';
import { UserTokenDto } from './entities/user-token.js';
import { UserTokenDataDto } from './entities/user-token-data.js';

/* https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id */
const OWASP_CONFIGS = [
  { m: 47104, t: 1, p: 1 } /* DO NOT USE WITH ARGON2I */,
  { m: 19456, t: 2, p: 1 } /* DO NOT USE WITH ARGON2I */,
  { m: 12288, t: 3, p: 1 },
  { m: 9216, t: 4, p: 1 },
  { m: 7168, t: 5, p: 1 },
];

@Injectable()
export class AuthService {
  private static CONFIG = OWASP_CONFIGS[2];

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private static hashPassword(password: string) {
    return hash(password, {
      type: argon2id,
      memoryCost: AuthService.CONFIG.m,
      timeCost: AuthService.CONFIG.t,
      parallelism: AuthService.CONFIG.p,
      hashLength: 32,
      salt: randomBytes(16),
    });
  }

  private static verifyPassword(hash: string, password: string) {
    return verify(hash, password);
  }

  async register(dto: AuthRegisterDto): Promise<CreatedUserDto> {
    const hashedPassword = await AuthService.hashPassword(dto.password);

    try {
      const { id: userId } = await this.prismaService.user.create({
        select: {
          id: true,
        },
        data: {
          email: dto.email,
          username: dto.username,
          hashedPassword: hashedPassword,
          firstname: dto.firstname,
          lastname: dto.lastname,
          phoneNumber: dto.phoneNumber,
        },
      });

      return {
        id: userId,
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && 'P2002' === e.code) {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async login(dto: AuthLoginDto): Promise<UserTokenDto> {
    const user = await this.prismaService.user.findFirst({
      select: {
        id: true,
        hashedPassword: true,
      },
      where: {
        email: dto.email,
      },
    });
    if (null === user) {
      throw new UnauthorizedException();
    }

    const passwordMatch = await AuthService.verifyPassword(
      user.hashedPassword,
      dto.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const token = await this.jwtService.signAsync({
      id: user.id,
    });
    return { token };
  }

  async verifyToken(token: string): Promise<UserTokenDataDto> {
    return await this.jwtService.verifyAsync<UserTokenDataDto>(token);
  }
}
