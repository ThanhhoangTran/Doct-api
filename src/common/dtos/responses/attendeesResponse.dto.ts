import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AttendeeDto {
  @Field(_type => ID)
  userId: string;

  @Field(_type => String)
  stun: string;
}
