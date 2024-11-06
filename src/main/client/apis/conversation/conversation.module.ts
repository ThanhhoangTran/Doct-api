import { Module } from '@nestjs/common';
import { ConversationRepository } from '../../../../repositories/conversation.repository';
import { ConversationService } from './conversation.service';
import { ConversationResolver } from './conversation.resolver';

@Module({
  providers: [ConversationResolver, ConversationService, ConversationRepository],
})
export class ConversationModule {}
