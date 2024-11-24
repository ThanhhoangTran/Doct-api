import { ObjectType } from '@nestjs/graphql';
import { PaginationResponse } from '../../../../../../common/response';
import { ChatMessage } from '../../../../../../schemas/chatMessage.schema';

@ObjectType({ isAbstract: true })
export class GetPagingChatMessageResponse extends PaginationResponse<ChatMessage>(ChatMessage) {}
