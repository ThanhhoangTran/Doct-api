import { Field, InputType } from '@nestjs/graphql';
import { ENUM_TYPE, EVENT_TYPE } from '../../../../../../common/constants';
import { DateRangeFilter } from '../../../../../../common/dtos/requests/dateRangeFilter.dto';

@InputType()
export class GetPagingSchedulerTimingEventFilter {
  @Field(_type => DateRangeFilter, { nullable: true })
  dateRange?: DateRangeFilter | null;

  @Field(_type => EVENT_TYPE, { nullable: true })
  eventType: ENUM_TYPE<typeof EVENT_TYPE> | null;
}
