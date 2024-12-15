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
import { ConnectionHandlerType } from './types/connectionHandlerType';
import { MessageContent, ProcessMessagePayload } from './types/processMessagePayload';

@Injectable()
export class ConnectionService {
  public constructor(
    @InjectModel(UserConnection.name) private readonly userConnection: Model<UserConnection>,
    @InjectModel(ChatMessage.name) private readonly chatMessage: Model<ChatMessage>,
    @InjectModel(Conversation.name) private readonly conversation: Model<Conversation>,
    private readonly jwtService: JwtService,
  ) {}

  public async connectionHandler(sourceIp: string, connectionId: string, authToken: string): Promise<ConnectionHandlerType> {
    let resultConnection: ConnectionHandlerType = {
      message: '',
    };

    try {
      const user: UserContextInterface = await this.jwtService.verifyAsync(authToken, { secret: configuration.jwt.secretKey });
      await this.userConnection.create({
        sourceIp,
        userId: user.id,
        connectionId,
      });

      resultConnection.message = 'Web-Socket Connected Successfully';
    } catch (error) {
      resultConnection.error = error;
    }
    return resultConnection;
  }

  public async disconnectHandler(connectionId: string): Promise<string> {
    await this.userConnection.deleteOne({
      connectionId,
    });

    return 'Web-Socket Disconnected Successfully';
  }

  public async process(payload: NotificationPayload): Promise<void> {
    const { connectionId, routeKey, body, callbackUrl } = payload;
    if (!connectionId) {
      return;
    }

    const gatewayAdapter = new GatewayAdapter(callbackUrl);
    console.log('🚀 ConnectionService - process', routeKey);

    switch (routeKey) {
      case ROUTE_KEY.MESSAGE: {
        await this.processMessage({
          connectionId,
          body,
          gateway: gatewayAdapter,
        });
        break;
      }
      case ROUTE_KEY.NOTIFICATION: {
      }
    }
  }

  private async processMessage(payload: ProcessMessagePayload) {
    const { connectionId, gateway, body } = payload;
    const { content, conversationId, visibilityReceiverIds, replyMessageId }: MessageContent = JSON.parse(body).data;

    const conversation = await this.conversation.findOne({ _id: conversationId });
    const senderConnection = await this.userConnection.findOne({ connectionId });

    if (!conversation || !senderConnection) {
      return;
    }

    const chatMessage = await this.chatMessage.create({
      message: content,
      conversationId: conversationId,
      visibilityReceiverIds: visibilityReceiverIds,
      senderId: senderConnection.userId,
      replyMessageId: replyMessageId,
    });

    let receiverIds = conversation.attendees.map(attendee => attendee.userId).filter(id => id !== senderConnection.userId);
    if (visibilityReceiverIds?.length) {
      receiverIds.filter(receiverId => visibilityReceiverIds.includes(receiverId));
    }

    const receiverConnections = await this.userConnection.find({
      userId: {
        $in: receiverIds,
      },
    });

    if (!receiverConnections.length) {
      return;
    }

    await Promise.all(receiverConnections.map(connection => gateway.sendToConnection(connection.connectionId, JSON.stringify(chatMessage))));
  }
}
