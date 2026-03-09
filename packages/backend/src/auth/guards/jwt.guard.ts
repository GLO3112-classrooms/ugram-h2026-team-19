import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthService } from '../auth.service.js';
import { type Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserTokenDataDto } from '../entities/user-token-data.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

  private static extractBearerToken(request: FastifyRequest): string {
    const authHeader = request.headers.authorization ?? '';
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) throw new UnauthorizedException();
    return token;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = AuthGuard.extractBearerToken(request);

    let loggoutToken: string | undefined = undefined;
    try {
      loggoutToken = await this.cacheService.get(`loggout-${token}`);
    } catch {
      throw new InternalServerErrorException();
    }
    if (loggoutToken === token) {
      throw new UnauthorizedException();
    }

    let payload: UserTokenDataDto;
    try {
      payload = await this.authService.verifyToken(token);
    } catch {
      throw new UnauthorizedException();
    }

    Object.defineProperty(request, 'user', {
      configurable: true,
      value: payload,
    });
    return true;
  }
}
