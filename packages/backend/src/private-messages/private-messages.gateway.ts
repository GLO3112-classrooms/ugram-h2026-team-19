import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service.js';
import { CreatedPrivateMessageDto } from './entities/created-private-message.js';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'messages',
})
export class PrivateMessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private activeUsers = new Map<string, string>();

  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: Socket) {
    try {
      const authHandshake = client.handshake.auth['token'] as string;
      const authHeader = client.handshake.headers?.authorization;

      let token = authHandshake;
      if (!token && authHeader) {
        const [bearer, headerToken] = authHeader.split(' ');
        if (bearer === 'Bearer' && headerToken) {
          token = headerToken;
        }
      }

      if (!token) {
        throw new Error('No token provided');
      }

      const isTokenInvalidated =
        await this.authService.isTokenInvalidated(token);
      if (isTokenInvalidated) {
        throw new Error('Token is invalidated');
      }

      const payload = await this.authService.verifyToken(token);

      const userId = payload.id;
      this.activeUsers.set(userId, client.id);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      client.data['userId'] = userId;

      console.log(`User ${userId} connected with socket ${client.id}`);
    } catch (error) {
      console.error(`WebSocket Authentication Failed: ${error}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = client.data['userId'] as string;
    if (userId) {
      this.activeUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  notifyRecipient(message: CreatedPrivateMessageDto) {
    const destinationSocketId = this.activeUsers.get(message.to);

    if (destinationSocketId) {
      this.server.to(destinationSocketId).emit('newMessage', message);
    }
  }
}
