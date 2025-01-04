import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChatMessageService } from './chatMessage.service';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { UserContext } from '../../../../common/decorators/user.decorator';
import { UserContextInterface } from '../../../../common/interface';
import { GetPagingChatMessageResponse } from './dtos/responses/getPagingChatMessagesResponse';
import { Auth } from '../../../../common/decorators/auth.decorator';

@Auth(['Role'])
@Resolver()
export class ChatMessageResolver {
  public constructor(private readonly chatMessageService: ChatMessageService) {}

  @Query(_type => GetPagingChatMessageResponse)
  public async getChatMessages(@Args('conversationId') conversationId: string, @Args('pagination') pagination: PaginationDto, @UserContext() ctx: UserContextInterface) {
    return await this.chatMessageService.getPagingMessagesByConversationId({
      userId: ctx.id,
      conversationId,
      pagination,
    });
  }
}
