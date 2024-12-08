import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatMessageService } from './chatMessage.service';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { UserContext } from '../../../../common/decorators/user.decorator';
import { UserContextInterface } from '../../../../common/interface';
import { GetPagingChatMessageResponse } from './dtos/responses/getPagingChatMessagesResponse';
import { SendMessageInputDto } from './dtos/inputs/sendMessageInput.dto';
import { Auth } from '../../../../common/decorators/auth.decorator';
// import { Inject } from '@nestjs/common';
// import { INJECTION_TOKEN } from '../../../../common/constants';
// import { PubSub } from 'graphql-subscriptions';

@Auth(['Role'])
@Resolver()
export class ChatMessageResolver {
  public constructor(private readonly chatMessageService: ChatMessageService) {}

  // @Subscription(() => String, {
  //   name: 'newMessage',
  //   resolve: payload => {
  //     console.log(payload);
  //     return payload;
  //   },
  // })
  // newMessage() {
  //   return this.chatMessageService.receiveMessage();
  // }

  // @Mutation(_type => String)
  // addMessage(@Args('message') message: string) {
  //   this.chatMessageService.sendMessage(message);
  //   return 'Successfully';
  // }

  @Query(_type => GetPagingChatMessageResponse)
  public async getChatMessages(@Args('conversationId') conversationId: string, @Args('pagination') pagination: PaginationDto, @UserContext() ctx: UserContextInterface) {
    return await this.chatMessageService.getPagingMessagesByConversationId({
      userId: ctx.id,
      conversationId,
      pagination,
    });
  }

  @Mutation(_type => String)
  public async sendMessage(@Args('input') input: SendMessageInputDto, @UserContext() user: UserContextInterface) {
    return await this.chatMessageService.sendMessage({
      senderId: user.id,
      ...input,
    });
  }
}
