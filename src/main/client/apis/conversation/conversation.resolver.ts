import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserContext } from '../../../../common/decorators/user.decorator';
import { UserContextInterface } from '../../../../common/interface';
import { MakeConversationInput } from './dtos/inputs/makeConversationInput.dto';
import { ConversationService } from './conversation.service';
import { GetPagingConversationResponse } from './dtos/responses/getPagingConversationResponse';
import { GetPagingConversationInput } from './dtos/inputs/getPagingConversationInput.dto';
import { Auth } from '../../../../common/decorators/auth.decorator';
import { ROLES_KEY } from '../../../../common/decorators/roles.decorator';

@Resolver()
@Auth([ROLES_KEY])
export class ConversationResolver {
  public constructor(private readonly conversationService: ConversationService) {}

  @Mutation(_type => String)
  public async makeConversation(@UserContext() userContext: UserContextInterface, @Args('input') input: MakeConversationInput): Promise<string> {
    await this.conversationService.createConversationRoom({
      createdBy: userContext,
      ...input,
    });

    return 'Create successfully';
  }

  @Query(_type => GetPagingConversationResponse)
  public async getPagingConversation(@UserContext() userContext: UserContextInterface, @Args('input') input: GetPagingConversationInput) {
    return await this.conversationService.getPagingConversations({
      user: userContext,
      pagination: input.pagination,
    });
  }
}
