import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class SendMessageInputDto {
  @Field(_type => [ID])
  conversationIds: string[];

  @Field(_type => String)
  message: string;
}
