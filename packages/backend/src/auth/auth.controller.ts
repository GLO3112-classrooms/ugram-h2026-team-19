import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { AuthRegisterDto } from './dto/register.dto.js';
import { CreatedUserDto } from './entity/created-user.dto.js';
import { AuthLoginDto } from './dto/login.dto.js';
import { UserTokenDto } from './entity/user-token.js';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreatedUserDto,
    description: 'The created user info',
  })
  @ApiConflictResponse({ description: 'The email is already taken' })
  @ApiInternalServerErrorResponse({
    description: 'This service is temporary unavailable',
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
  @ApiNotFoundResponse({
    description: 'Either the email or the password is invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'This service is temporary unavailable',
  })
  async login(@Body() body: AuthLoginDto): Promise<UserTokenDto> {
    return await this.authService.login(body);
  }
}
