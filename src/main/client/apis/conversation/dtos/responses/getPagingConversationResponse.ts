import { ObjectType } from '@nestjs/graphql';
import { PaginationResponse } from '../../../../../../common/response';
import { Conversation } from '../../../../../../entities/conversation.entity';

@ObjectType({ isAbstract: true })
export class GetPagingConversationResponse extends PaginationResponse(Conversation) {}
