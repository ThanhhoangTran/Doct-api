import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GetPagingChatMessageInputDto {
  @Field(_type => ID)
  conversationId: string;
}
