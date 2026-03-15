import { Module } from '@nestjs/common';
import { S3Service } from './s3.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: S3Service,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const s3Endpoint = configService.getOrThrow<string>('S3_ENDPOINT');

        const s3Region = configService.getOrThrow<string>('S3_REGION');

        const s3AccessKeyId =
          configService.getOrThrow<string>('S3_ACCESS_KEY_ID');

        const s3SecretAccessKey = configService.getOrThrow<string>(
          'S3_SECRET_ACCESS_KEY',
        );

        return new S3Service(
          s3Endpoint,
          s3Region,
          s3AccessKeyId,
          s3SecretAccessKey,
        );
      },
    },
  ],
  exports: [S3Service],
})
export class S3Module {}
