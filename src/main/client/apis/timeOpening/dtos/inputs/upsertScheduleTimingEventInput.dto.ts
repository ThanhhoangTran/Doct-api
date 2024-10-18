import { Field, ID, InputType } from '@nestjs/graphql';
import { EVENT_TYPE } from '../../../../../../common/constants';

@InputType()
export class UpsertScheduleTimingEventInput {
  @Field(_type => ID, { nullable: true })
  id?: string | null;

  @Field(_type => String, { defaultValue: EVENT_TYPE.APPOINTMENT })
  eventType: string;

  @Field()
  startOpening: Date;

  @Field()
  endOpening: Date;
}
