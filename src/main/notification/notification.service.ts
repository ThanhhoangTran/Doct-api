import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserConnection } from '../../schemas/userConnection';
import { JwtService } from '@nestjs/jwt';
import { configuration } from '../../config';
import { NotificationPayload, UserContextInterface } from '../../common/interface';
import { ROUTE_KEY } from '../../common/constants';
import { ChatMessage } from '../../schemas/chatMessage.schema';
import { Conversation } from '../../schemas/conversation.schema';
import { GatewayAdapter } from '../../service/aws/gateway';

@Injectable()
export class NotificationService {
  public constructor(
    @InjectModel(UserConnection.name) private readonly userConnection: Model<UserConnection>,
    @InjectModel(ChatMessage.name) private readonly chatMessage: Model<ChatMessage>,
    @InjectModel(Conversation.name) private readonly conversation: Model<Conversation>,
    private readonly jwtService: JwtService,
  ) {}

  public async connectionHandler(sourceIp: string, connectionId: string, authToken: string): Promise<string> {
    const user: UserContextInterface = await this.jwtService.verifyAsync(authToken, { secret: configuration.jwt.secretKey });
    await this.userConnection.create({
      sourceIp,
      userId: user.id,
      connectionId,
    });

    return 'Web-Socket Connected Successfully';
  }

  public async disconnectHandler(connectionId: string): Promise<string> {
    await this.userConnection.deleteOne({
      connectionId,
    });

    return 'Web-Socket Disconnected Successfully';
  }

  public async notificationHandler(payload: NotificationPayload): Promise<void> {
    const { connectionId, routeKey, body, callbackUrl } = payload;
    if (!connectionId) {
      return;
    }

    const parsedBody = JSON.parse(body);
    const gatewayAdapter = new GatewayAdapter(callbackUrl);

    switch (routeKey) {
      case ROUTE_KEY.NOTIFICATION: {
        const { conversationId, message } = parsedBody;
        const conversation = await this.conversation.findOne({ _id: conversationId });
        const senderConnection = await this.userConnection.findOne({ connectionId });

        if (!conversation || !senderConnection) {
          return;
        }

        await this.chatMessage.create({
          message,
          conversationId: conversationId,
          senderId: senderConnection.userId,
          replyMessageId: null,
        });

        const receiverIds = conversation.attendees.map(attendee => attendee.userId).filter(id => id !== senderConnection.userId);

        const receiverConnections = await this.userConnection.find({
          userId: {
            $in: receiverIds,
          },
        });

        if (!receiverConnections.length) {
          return;
        }

        await Promise.all(receiverConnections.map(connection => gatewayAdapter.sendToConnection(connection.connectionId, message)));
      }
    }
  }
}
