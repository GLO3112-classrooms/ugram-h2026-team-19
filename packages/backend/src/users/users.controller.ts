import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type FastifyRequest } from 'fastify';
import { UsersService } from './users.service.js';
import { UserDataDto } from './entities/user-data.js';
import { AuthGuard } from '../auth/guards/jwt.guard.js';
import { UserTokenDataDto } from '../auth/entities/user-token-data.js';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth('jwt')
@ApiUnauthorizedResponse({
  description:
    'The client is trying to access the route without being authenticated.',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The user was found and its attributes are returned.',
    type: UserDataDto,
  })
  @ApiNotFoundResponse({
    description:
      "The user is authenticated but its account was deleted. Until the token expires, the user won't be found in database.",
  })
  async retrieveMe(@Req() request: FastifyRequest): Promise<UserDataDto> {
    const token = request['user'] as UserTokenDataDto;

    return await this.usersService.retrieveMe(token);
  }
}
