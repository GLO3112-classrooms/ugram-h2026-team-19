import { Module } from '@nestjs/common';
import { PrivateMessagesController } from './private-messages.controller.js';
import { PrivateMessagesService } from './private-messages.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PrivateMessagesGateway } from './private-messages.gateway.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PrivateMessagesController],
  providers: [PrivateMessagesService, PrivateMessagesGateway],
})
export class PrivateMessagesModule {}
