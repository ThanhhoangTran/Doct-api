import { EVENT_TYPE } from '@/common/constants';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimeOpeningResponse {
  @Field(_type => ID)
  id: string;

  @Field(_type => Date)
  startOpening: Date;

  @Field(_type => Date)
  endOpening: string;

  @Field(_type => EVENT_TYPE)
  event: string;

  @Field(_type => ID)
  userId: string;
}
