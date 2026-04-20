import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { S3Module } from './s3/s3.module.js';
import { StaticModule } from './static/static.module.js';
import { PostsModule } from './posts/posts.module.js';
import { RedisOptions } from './app.config.js';
import { HealthModule } from './health/health.module.js';
import { PrivateMessagesModule } from './private-messages/private-messages.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
    PrismaModule,
    AuthModule,
    UsersModule,
    S3Module,
    StaticModule,
    PostsModule,
    HealthModule,
    PrivateMessagesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
