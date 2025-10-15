import { Field, InputType } from '@nestjs/graphql';
import { EVENT_TYPE } from '../../../../../../common/constants';

@InputType()
export class GetTimeOpeningRangesAvailableInputType {
  @Field(_type => Date)
  startDate: Date;

  @Field(_type => Date, { nullable: true, defaultValue: new Date() })
  endDate: Date;

  @Field(_type => EVENT_TYPE, { nullable: true })
  filterByOpeningType?: string | null;
}
