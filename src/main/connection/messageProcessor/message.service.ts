import { Injectable } from '@nestjs/common';
import { MessageContent, ProcessMessagePayload } from '../types/processMessagePayload';
import { UserConnection } from '../../../schemas/userConnection';
import { ChatMessage } from '../../../schemas/chatMessage.schema';
import { Conversation } from '../../../schemas/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActionResponse } from '../dtos/responses/actionResponse';
import { ROUTE_KEY } from '../../../common/constants';

@Injectable()
export class MessageProcessorService {
  public constructor(
    @InjectModel(UserConnection.name) private readonly userConnection: Model<UserConnection>,
    @InjectModel(ChatMessage.name) private readonly chatMessage: Model<ChatMessage>,
    @InjectModel(Conversation.name) private readonly conversation: Model<Conversation>,
    
  ) {}

  public async process(payload: ProcessMessagePayload) {
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

    await Promise.all(receiverConnections.map(connection => gateway.sendToConnection(connection.connectionId, ActionResponse(ROUTE_KEY.MESSAGE, chatMessage))));
  }
}
