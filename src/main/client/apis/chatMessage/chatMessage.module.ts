import { Module } from '@nestjs/common';
import { ChatMessageService } from './chatMessage.service';
import { ChatMessageResolver } from './chatMessage.resolver';

@Module({
  providers: [ChatMessageResolver, ChatMessageService],
})
export class ChatMessageModule {}
