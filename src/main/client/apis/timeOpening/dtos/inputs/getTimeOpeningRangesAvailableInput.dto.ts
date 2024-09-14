import { EVENT_TYPE } from '@/common/constants';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetTimeOpeningRangesAvailableInput {
  @Field(_type => Date)
  startDate: Date;

  @Field(_type => Date, { nullable: true, defaultValue: new Date() })
  endDate: Date;

  @Field(_type => EVENT_TYPE, { nullable: true })
  filterByOpeningType?: string | null;
}
