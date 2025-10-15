import { Field, InputType } from '@nestjs/graphql';
import { CONSULTATION_STATUS, CONSULTATION_TYPE } from '../../../../../../common/constants';
import { DateRangeFilter } from '../../../../../../common/dtos/requests/dateRangeFilter.dto';

@InputType()
export class GetPagingConsultationScheduleFilter {
  @Field(_type => [CONSULTATION_TYPE], { nullable: true })
  consultationTypes?: string[] | null;

  @Field(_type => [CONSULTATION_STATUS], { nullable: true })
  consultationStatuses?: string[] | null;

  @Field(_type => DateRangeFilter, { nullable: true })
  dateRanges?: DateRangeFilter | null;
}
