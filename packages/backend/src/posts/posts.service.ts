import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service.js';
import { S3Service } from 'src/s3/s3.service.js';

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}
}
