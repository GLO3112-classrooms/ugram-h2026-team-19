import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type FastifyRequest } from 'fastify';
import { UsersService } from './users.service.js';
import { UserDataDto } from './entities/user-data.js';
import { AuthGuard } from '../auth/guards/jwt.guard.js';
import { UserTokenDataDto } from '../auth/entities/user-token-data.js';
import { userAvatarUploadSchema } from './schemas/user-avatar-upload.schema.js';
import { UserAvatarUploadResponseDto } from './entities/user-avatar-upload.js';
import { UserUpdateDataDto } from './entities/user-update-data.js';
import {
  UserDataListDto,
  UserDataListQueryDto,
} from './entities/user-data-list.js';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth('jwt')
@ApiUnauthorizedResponse({
  description:
    'The client is trying to access the route without being authenticated.',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private static getOrigin(request: FastifyRequest): string {
    return `${request.protocol}://${request.headers.host}`;
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The users were found and their attributes are returned.',
    type: UserDataListDto,
  })
  async retrieveAll(
    @Query() query: UserDataListQueryDto,
  ): Promise<UserDataListDto> {
    return await this.usersService.retrieveAll(query);
  }

  @Get('/:userId')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The user was found and its attributes are returned.',
    type: UserDataDto,
  })
  @ApiParam({
    name: 'userId',
    description: "The user's ID.",
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'The user with the specified id was not found.',
  })
  async retrieveById(@Param('userId') userId: string): Promise<UserDataDto> {
    return await this.usersService.retrieveById(userId);
  }

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

  @Patch('/me')
  @UseGuards(AuthGuard)
  @ApiBody({
    type: UserUpdateDataDto,
    description:
      'The user attributes to update. All fields are optionnal but at least one is expected.',
  })
  @ApiOkResponse({
    type: UserDataDto,
    description:
      'The user data was updated and the new attributes are returned.',
  })
  @ApiBadRequestResponse({
    description: 'The request body is malformed.',
  })
  async updateMe(
    @Req() request: FastifyRequest,
    @Body() body: UserUpdateDataDto,
  ) {
    const token = request['user'] as UserTokenDataDto;
    return await this.usersService.updateMe(token, body);
  }

  @Post('me/avatar')
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    // type: UserAvatarUploadDto,
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description:
            userAvatarUploadSchema.shape.avatar.description ??
            "The binary file representing the user's new avatar.",
        },
      },
      required: ['avatar'],
    },
  })
  @ApiOkResponse({
    type: UserAvatarUploadResponseDto,
    description: 'The user profile picture has been uploaded.',
  })
  @ApiBadRequestResponse({
    description: 'The request body is malformed.',
  })
  async uploadAvatar(@Req() request: FastifyRequest) {
    const token = request['user'] as UserTokenDataDto;

    const file = await request.file();

    if (undefined === file) {
      throw new BadRequestException();
    }

    const origin = UsersController.getOrigin(request);
    return await this.usersService.uploadAvatar(token, file, origin);
  }
}
