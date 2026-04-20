import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrivateMessagesService } from './private-messages.service.js';
import { AuthGuard } from '../auth/guards/jwt.guard.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type FastifyRequest } from 'fastify';
import { UserTokenDataDto } from '../auth/entities/user-token-data.js';
import { PrivateMessageCreateDto } from './dto/create-private-message.dto.js';
import { CreatedPrivateMessageDto } from './entities/created-private-message.js';
import { UserTokenData } from '../index.schema.js';
import { PrivateMessageListDto } from './dto/private-message-list.dto.js';

@Controller('private-messages')
@ApiTags('Private Messages')
@ApiBearerAuth('jwt')
@ApiUnauthorizedResponse({
  description:
    'The client is trying to access the route without being authenticated.',
})
export class PrivateMessagesController {
  constructor(
    private readonly privateMessagesService: PrivateMessagesService,
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: PrivateMessageListDto,
    description:
      "The list of new messages. If 'since' (ISO datetime) is null, returns all message.",
  })
  async list(
    @Req() request: FastifyRequest,
    @Query('since') since?: string,
  ): Promise<PrivateMessageListDto> {
    const token = request['user'] as UserTokenData;
    return await this.privateMessagesService.list(
      token.id,
      since ?? '1970-01-01T00:00:00.000Z',
    );
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'id',
    description:
      'The ID of the user related to the private message list to fetch',
  })
  @ApiOkResponse({
    type: PrivateMessageListDto,
    description: 'The list of private message with a given user.',
  })
  async get(
    @Req() request: FastifyRequest,
    @Param('id') userId: string,
    @Query('since') since?: string,
  ): Promise<PrivateMessageListDto> {
    const token = request['user'] as UserTokenData;
    return await this.privateMessagesService.getMessagesWith(
      token.id,
      userId,
      since ?? '1970-01-01T00:00:00.000Z',
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: PrivateMessageCreateDto,
    description: 'The payload to create a new private message.',
  })
  @ApiCreatedResponse({
    description: 'The private message has been created.',
    type: CreatedPrivateMessageDto,
  })
  @ApiBadRequestResponse({
    description: 'The request provided bad body.',
  })
  async create(
    @Req() request: FastifyRequest,
    @Body() dto: PrivateMessageCreateDto,
  ): Promise<CreatedPrivateMessageDto> {
    const token = request['user'] as UserTokenDataDto;

    return await this.privateMessagesService.create(token, dto);
  }
}
