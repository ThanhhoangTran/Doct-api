import { ObjectType } from '@nestjs/graphql';
import { PaginationResponse } from '../../../../../../common/response';
import { Conversation } from '../../../../../../schemas/conversation.schema';

@ObjectType({ isAbstract: true })
export class GetPagingConversationResponse extends PaginationResponse(Conversation) {}
