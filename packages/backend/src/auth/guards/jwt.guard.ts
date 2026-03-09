import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AuthService } from '../auth.service.js';
import { UserTokenDataDto } from '../entities/user-token-data.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  private static extractBearerToken(request: FastifyRequest): string {
    const authHeader = request.headers.authorization ?? '';
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) throw new UnauthorizedException();
    return token;
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = AuthGuard.extractBearerToken(request);

    const isTokenInvalidated = await this.authService.isTokenInvalidated(token);
    if (isTokenInvalidated) {
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

    Object.defineProperty(request, 'token', {
      configurable: true,
      value: token,
    });
    return true;
  }
}
