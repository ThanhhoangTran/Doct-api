import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from '../../../../schemas/chatMessage.schema';
import { ChatMessageService } from './chatMessage.service';
import { ChatMessageResolver } from './chatMessage.resolver';
import { Conversation, ConversationSchema } from '../../../../schemas/conversation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatMessage.name,
        schema: ChatMessageSchema,
      },
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
    ]),
  ],
  providers: [ChatMessageResolver, ChatMessageService],
})
export class ChatMessageModule {}
