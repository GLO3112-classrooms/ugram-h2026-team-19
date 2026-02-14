import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { S3Module } from '../s3/s3.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, AuthModule, S3Module],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
