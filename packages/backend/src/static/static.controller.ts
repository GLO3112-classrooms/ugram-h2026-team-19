import path from 'node:path/posix';
import { type FastifyReply } from 'fastify';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';
import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { StaticService } from './static.service.js';
import { USER_AVATAR_UPLOAD_MIME_TYPES } from '../users/schemas/user-avatar-upload.schema.js';
import { POST_IMAGE_UPLOAD_MIME_TYPES } from '../posts/schemas/post-image-upload.schema.js';

@Controller('static')
@ApiNotFoundResponse({
  description: 'The provided static resolves no resource.',
})
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Get('/avatars/:userId/:filename')
  @ApiProduces(...USER_AVATAR_UPLOAD_MIME_TYPES)
  @ApiOkResponse({
    description: 'The user avatar image file.',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiParam({
    name: 'userId',
    description: "The user's ID.",
    type: String,
  })
  @ApiParam({
    name: 'filename',
    description: 'The filename of the avatar.',
    type: String,
  })
  async getAvatar(
    @Param('userId') userId: string,
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const fileObject = await this.staticService.fetchFile(
      'avatars',
      path.join(userId, filename),
    );

    res.headers({
      'Content-Type': fileObject.contentType,
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    return new StreamableFile(fileObject.stream);
  }

  @Get('/images/:postId/:filename')
  @ApiProduces(...POST_IMAGE_UPLOAD_MIME_TYPES)
  @ApiOkResponse({
    description: 'The post image file.',
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiParam({
    name: 'postId',
    description: "The post's ID.",
    type: String,
  })
  @ApiParam({
    name: 'filename',
    description: 'The filename of the post image.',
    type: String,
  })
  async getImage(
    @Param('postId') postId: string,
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const fileObject = await this.staticService.fetchFile(
      'images',
      path.join(postId, filename),
    );

    res.headers({
      'Content-Type': fileObject.contentType,
      'Content-Disposition': `inline; filename="${filename}"`,
    });

    return new StreamableFile(fileObject.stream);
  }
}
