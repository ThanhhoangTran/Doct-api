import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from '../../../../schemas/chatMessage.schema';
import { BuilderPaginationResponse } from '../../../../utils/utilFunction';

@Injectable()
export class ChatMessageService {
  public constructor(@InjectModel(ChatMessage.name) private readonly chatMessageModel: Model<ChatMessage>) {}

  public async getPagingMessagesByConversationId({ pagination, conversationId }: { pagination?: PaginationDto; userId: string; conversationId: string }) {
    const builder = this.chatMessageModel.find({
      conversationId,
    });

    return await new BuilderPaginationResponse<ChatMessage>(builder, pagination).execute();
  }
}
