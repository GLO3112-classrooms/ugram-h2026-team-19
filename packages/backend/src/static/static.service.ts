import { Injectable } from '@nestjs/common';
import { S3Service } from '../s3/s3.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StaticService {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  getStaticOrigin() {
    return this.configService.getOrThrow<string>('STATIC_ORIGIN');
  }

  async fetchFile(bucket: string, key: string) {
    const absoluteBucket = this.configService.getOrThrow<string>('S3_BUCKET');
    return await this.s3Service.pull(absoluteBucket, `${bucket}/${key}`);
  }
}
