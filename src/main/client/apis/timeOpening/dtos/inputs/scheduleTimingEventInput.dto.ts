import { EVENT_TYPE } from '@/common/constants';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpsertScheduleTimingEventInput {
  @Field(_type => ID, { nullable: true })
  id?: string | null;

  @Field(_type => EVENT_TYPE, { defaultValue: EVENT_TYPE.APPOINTMENT })
  eventType: string;

  @Field()
  startOpening: Date;

  @Field()
  endOpening: Date;
}
