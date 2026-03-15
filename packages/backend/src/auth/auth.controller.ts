import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import fastify from 'fastify';
import { AuthService } from './auth.service.js';
import { AuthRegisterDto } from './dto/register.dto.js';
import { CreatedUserDto } from './entities/created-user.js';
import { AuthLoginDto } from './dto/login.dto.js';
import { UserTokenDto } from './entities/user-token.js';
import { AuthGuard } from './guards/jwt.guard.js';
import { UserTokenDataDto } from './entities/user-token-data.js';

@Controller('auth')
@ApiTags('Authentication')
@ApiInternalServerErrorResponse({
  description: 'This service is temporary unavailable',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreatedUserDto,
    description: 'The created user info',
  })
  @ApiConflictResponse({
    description: 'The email or username is already taken',
  })
  async register(@Body() body: AuthRegisterDto): Promise<CreatedUserDto> {
    return await this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserTokenDto,
    description: 'The user token used to communicate with the API',
  })
  @ApiUnauthorizedResponse({
    description: 'Either the email or the password is invalid',
  })
  async login(@Body() body: AuthLoginDto): Promise<UserTokenDto> {
    return await this.authService.login(body);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The bearer token has been invalidated',
  })
  @ApiUnauthorizedResponse({
    description: 'You must be logged in before trying to logout',
  })
  async logout(@Req() req: fastify.FastifyRequest): Promise<void> {
    const token = req['user'] as UserTokenDataDto;
    const rawToken = req['token'] as string;

    await this.authService.invalidateToken(token, rawToken);
  }

  @Get('google')
  async googleLogin(@Res() reply: fastify.FastifyReply) {
    return await this.authService.googleLogin(reply);
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    return this.authService.googleCallback(code, state);
  }
}
