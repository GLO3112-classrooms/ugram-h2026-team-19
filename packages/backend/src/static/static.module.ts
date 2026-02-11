import { Module } from '@nestjs/common';
import { StaticController } from './static.controller.js';
import { StaticService } from './static.service.js';
import { S3Module } from '../s3/s3.module.js';

@Module({
  imports: [S3Module],
  controllers: [StaticController],
  providers: [StaticService],
})
export class StaticModule {}
