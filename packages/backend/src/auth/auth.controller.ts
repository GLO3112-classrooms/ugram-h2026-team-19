import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { AuthRegisterDto } from './dto/register.dto.js';
import { CreatedUserDto } from './entities/created-user.js';
import { AuthLoginDto } from './dto/login.dto.js';
import { UserTokenDto } from './entities/user-token.js';

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
}
