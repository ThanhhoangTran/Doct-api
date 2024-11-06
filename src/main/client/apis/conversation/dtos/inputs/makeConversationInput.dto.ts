import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class MakeConversationInput {
  @Field(_type => String)
  roomName: string;

  @Field(_type => [ID])
  attendeeIDs: string[];
}
