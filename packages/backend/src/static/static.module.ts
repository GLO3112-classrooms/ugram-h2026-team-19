import { Module } from '@nestjs/common';
import { StaticController } from './static.controller.js';
import { StaticService } from './static.service.js';
import { S3Module } from '../s3/s3.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, S3Module],
  controllers: [StaticController],
  providers: [StaticService],
  exports: [StaticService],
})
export class StaticModule {}
