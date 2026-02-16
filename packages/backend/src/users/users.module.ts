import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { S3Module } from '../s3/s3.module.js';
import { StaticModule } from '../static/static.module.js';

@Module({
  imports: [PrismaModule, AuthModule, S3Module, StaticModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
