import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from '../../../../schemas/chatMessage.schema';
import { BuilderPaginationResponse } from '../../../../utils/utilFunction';
// import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class ChatMessageService {
  public constructor(
    // @Inject('PUB_SUB') private readonly pubSub: PubSub,
    @InjectModel(ChatMessage.name) private readonly chatMessageModel: Model<ChatMessage>,
  ) {}

  public async getPagingMessagesByConversationId({ pagination, userId, conversationId }: { pagination?: PaginationDto; userId: string; conversationId: string }) {
    const builder = this.chatMessageModel.find({
      conversationId,
    });
    return await new BuilderPaginationResponse<ChatMessage>(builder, pagination).execute();
  }

  // public async sendMessage({ senderId, conversationIds, message }: SendMessageInput) {
  //   const conversations = await this.conversationModel.find({
  //     _id: {
  //       $in: conversationIds,
  //     },
  //   });

  //   if (conversationIds.length !== conversations.length) {
  //     throw new UserInputError('Conversation is not found!');
  //   }

  //   const { insertedIds } = await this.chatMessageModel.bulkSave(conversationIds.map(conversationId => new this.chatMessageModel({ senderId, conversationId, message })));

  //   if (!Object.keys(insertedIds).length) {
  //     throw new UserInputError("Don't have any message be send!");
  //   }

  //   return 'Send message successfully!';
  // }
}
