import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service.js';
import { AuthGuard } from '../auth/guards/jwt.guard.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type FastifyRequest } from 'fastify';
import { UserTokenDataDto } from '../auth/entities/user-token-data.js';
import { PostCreateDto } from './dto/create-post.dto.js';
import { CreatedPostDto } from './entities/created-post.js';
import { postImageUploadSchema } from './schemas/post-image-upload.schema.js';
import { PostImageUploadResponseDto } from './entities/post-image-upload.js';
import { type UUID } from 'node:crypto';
import { UserTokenData } from 'src/index.schema.js';
import { PostDataDto } from './entities/post-data.js';

@Controller('posts')
@ApiTags('Posts')
@ApiBearerAuth('jwt')
@ApiUnauthorizedResponse({
  description:
    'The client is trying to access the route without being authenticated.',
})
@ApiBadRequestResponse({
  description: 'The request provided bad body.',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  private static getOrigin(request: FastifyRequest): string {
    return `${request.protocol}://${request.headers.host}`;
  }

  @Get(':id')
  @ApiOkResponse({
    type: PostDataDto,
  })
  @ApiNotFoundResponse({
    description: 'The given post ID resolves no post.',
  })
  async get(@Param('id') id: UUID): Promise<PostDataDto> {
    return await this.postsService.get(id);
  }

  @Post('/')
  @UseGuards(AuthGuard)
  @ApiBody({
    type: PostCreateDto,
    description: 'The payload to create a new post.',
  })
  @ApiCreatedResponse({
    description: 'The post has been created.',
    type: CreatedPostDto,
  })
  async create(
    @Req() request: FastifyRequest,
    @Body() dto: PostCreateDto,
  ): Promise<CreatedPostDto> {
    const token = request['user'] as UserTokenDataDto;

    return await this.postsService.create(token, dto);
  }

  @Post(':id/image')
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'The ID of the post to which the image is related.',
  })
  @ApiBody({
    // type: PostImageUploadDto,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description:
            postImageUploadSchema.shape.image.description ??
            "The binary file representing the post's new image.",
        },
      },
      required: ['image'],
    },
  })
  @ApiOkResponse({
    type: PostImageUploadResponseDto,
    description: 'The post image has been uploaded.',
  })
  @ApiBadRequestResponse({
    description: 'The request body is malformed.',
  })
  @ApiNotFoundResponse({
    description: 'The given post ID resolves no post.',
  })
  @ApiForbiddenResponse({
    description:
      'The authenticated user does not have the permission to update this post.',
  })
  async uploadImage(@Req() request: FastifyRequest, @Param('id') id: UUID) {
    const token = request['user'] as UserTokenData;
    const file = await request.file();

    if (undefined === file) {
      throw new BadRequestException();
    }

    const origin = PostsController.getOrigin(request);
    return await this.postsService.uploadImage(token, id, file, origin);
  }
}
