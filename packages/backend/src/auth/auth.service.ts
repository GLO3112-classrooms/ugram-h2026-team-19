import { randomBytes } from 'node:crypto';
import {
  ConflictException,
  Inject,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import fastify from 'fastify';
import { firstValueFrom } from 'rxjs';
import { GoogleTokenDto } from './entities/google-token.js';
import { GoogleProfileDto } from './entities/google-profile.js';
import { HttpService } from '@nestjs/axios';

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
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
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

  async invalidateToken(
    token: UserTokenDataDto,
    rawToken: string,
  ): Promise<void> {
    const now = Date.now();
    const delta = token.exp * 1000 - now;
    if (0 < delta) {
      await this.cacheService.set(`loggout-${rawToken}`, '1', delta);
    }
  }

  async isTokenInvalidated(rawToken: string) {
    return (await this.cacheService.get(`loggout-${rawToken}`)) === '1';
  }

  async googleLogin(reply: fastify.FastifyReply) {
    const state = randomBytes(32).toString('hex');
    await this.cacheService.set(`oauth_state:${state}`, '1', 300000);

    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
      response_type: 'code',
      scope: 'email profile openid',
      state,
    });

    return reply
      .status(302)
      .header(
        'Location',
        `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      )
      .send();
  }

  async googleCallback(code: string, state: string) {
    const stored = await this.cacheService.get(`oauth_state:${state}`);
    if (stored !== '1')
      throw new UnauthorizedException('Invalid or expired state');

    await this.cacheService.del(`oauth_state:${state}`);

    // Exchange code for tokens
    const { data } = await firstValueFrom(
      this.httpService.post<GoogleTokenDto>(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL,
          grant_type: 'authorization_code',
        },
      ),
    );

    // Get user profile
    const { data: profile } = await firstValueFrom(
      this.httpService.get<GoogleProfileDto>(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      ),
    );

    return await this.validateGoogleUser(profile);
  }

  async validateGoogleUser(profile: GoogleProfileDto): Promise<UserTokenDto> {
    const user = await this.prismaService.user.findFirst({
      select: {
        id: true,
      },
      where: {
        email: profile.email,
      },
    });

    if (user === null) {
      const createdUser = await this.prismaService.user.create({
        select: {
          id: true,
        },
        data: {
          email: profile.email,
          username: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
        },
      });

      const token = await this.jwtService.signAsync({
        id: createdUser.id,
      });
      return { token };
    }

    const token = await this.jwtService.signAsync({
      id: user.id,
    });
    return { token };
  }
}
