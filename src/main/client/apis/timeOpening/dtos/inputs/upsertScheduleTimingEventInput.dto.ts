import { Field, ID, InputType } from '@nestjs/graphql';
import { EVENT_TYPE } from '../../../../../../common/constants';

@InputType()
export class UpsertScheduleTimingEventInputType {
  @Field(_type => ID, { nullable: true })
  id?: string | null;

  @Field(_type => EVENT_TYPE, { defaultValue: EVENT_TYPE.APPOINTMENT })
  eventType: string;

  @Field()
  startOpening: Date;

  @Field()
  endOpening: Date;
}
