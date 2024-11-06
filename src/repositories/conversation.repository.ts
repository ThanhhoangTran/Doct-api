import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/baseRepository';
import { DataSource } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';

@Injectable()
export class ConversationRepository extends BaseRepository<Conversation> {
  constructor(private dataSource: DataSource) {
    super(Conversation, dataSource.createEntityManager());
  }
}
