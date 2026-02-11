import { Injectable } from '@nestjs/common';
import { S3Service } from '../s3/s3.service.js';

@Injectable()
export class StaticService {
  constructor(private readonly s3Service: S3Service) {}

  async fetchFile(bucket: string, key: string) {
    return await this.s3Service.pull(bucket, key);
  }
}
