import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { type UUID } from 'node:crypto';
import { UserTokenData } from '../index.schema.js';
import { NotificationType } from '../prisma/generated/enums.js';

const NOTIFICATION_SELECT = {
  id: true,
  type: true,
  read: true,
  createdAt: true,
  actor: {
    select: {
      id: true,
      username: true,
      profilePicture: true,
    },
  },
  post: {
    select: {
      id: true,
      description: true,
    },
  },
} as const;

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    type: NotificationType,
    actorId: string,
    recipientId: string,
    postId: string,
  ): Promise<void> {
    if (actorId === recipientId) return;

    await this.prismaService.notification.create({
      data: {
        type,
        actor: { connect: { id: actorId } },
        recipient: { connect: { id: recipientId } },
        post: { connect: { id: postId } },
      },
    });
  }

  async list(token: UserTokenData) {
    const notifications = await this.prismaService.notification.findMany({
      where: { recipientId: token.id },
      select: NOTIFICATION_SELECT,
      orderBy: { createdAt: 'desc' },
    });

    return notifications.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    }));
  }

  async markAsRead(token: UserTokenData, id: UUID): Promise<void> {
    await this.prismaService.notification.updateMany({
      where: { id, recipientId: token.id },
      data: { read: true },
    });
  }

  async markAllAsRead(token: UserTokenData): Promise<void> {
    await this.prismaService.notification.updateMany({
      where: { recipientId: token.id, read: false },
      data: { read: true },
    });
  }
}
