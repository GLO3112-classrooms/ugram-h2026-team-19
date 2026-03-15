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

  getBucket() {
    return this.configService.getOrThrow<string>('S3_BUCKET');
  }

  async fetchFile(key: string) {
    return await this.s3Service.pull(this.getBucket(), key);
  }
}
