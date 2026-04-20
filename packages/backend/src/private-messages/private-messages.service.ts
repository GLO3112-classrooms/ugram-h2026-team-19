import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserTokenDataDto } from '../auth/entities/user-token-data.js';
import { PrivateMessageCreateDto } from './dto/create-private-message.dto.js';
import { CreatedPrivateMessageDto } from './entities/created-private-message.js';
import { PrivateMessageList } from './schemas/private-message-list.schema.js';
import { PrivateMessagesGateway } from './private-messages.gateway.js';

@Injectable()
export class PrivateMessagesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly messagesGateway: PrivateMessagesGateway,
  ) {}

  async getMessagesWith(
    me: string,
    userId: string,
    since: string,
  ): Promise<PrivateMessageList> {
    const mySentMessages = await this.prismaService.privateMessage.findMany({
      select: {
        id: true,
        fromUserId: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      where: {
        fromUserId: me,
        toUserId: userId,
        createdAt: { gt: new Date(since) },
      },
    });

    const theirSentMessage = await this.prismaService.privateMessage.findMany({
      select: {
        id: true,
        fromUserId: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      where: {
        fromUserId: userId,
        toUserId: me,
        createdAt: { gt: new Date(since) },
      },
    });

    return [...mySentMessages, ...theirSentMessage]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((msg) => ({
        id: msg.id,
        from: msg.fromUserId,
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
      }));
  }

  async list(me: string, since: string): Promise<PrivateMessageList> {
    const newMessages = await this.prismaService.privateMessage.findMany({
      select: {
        id: true,
        fromUserId: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      where: {
        toUserId: me,
        createdAt: { gt: new Date(since) },
      },
    });

    return newMessages.map((msg) => ({
      id: msg.id,
      from: msg.fromUserId,
      content: msg.content,
      createdAt: msg.createdAt.toISOString(),
    }));
  }

  async create(
    token: UserTokenDataDto,
    dto: PrivateMessageCreateDto,
  ): Promise<CreatedPrivateMessageDto> {
    const message = await this.prismaService.privateMessage.create({
      data: {
        fromUserId: token.id,
        toUserId: dto.to,
        content: dto.content,
      },
      select: {
        id: true,
        fromUserId: true,
        toUserId: true,
        content: true,
        createdAt: true,
      },
    });

    const refinedMessage = {
      id: message.id,
      from: message.fromUserId,
      to: message.toUserId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    };

    this.messagesGateway.notifyRecipient(refinedMessage);

    return refinedMessage;
  }
}
