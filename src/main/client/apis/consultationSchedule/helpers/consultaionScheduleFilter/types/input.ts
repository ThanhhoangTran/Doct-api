import { SelectQueryBuilder } from 'typeorm';
import { DateRangeFilter } from '../../../../../../../common/dtos/requests/dateRangeFilter.dto';
import { ConsultationSchedule } from '../../../../../../../entities/consultationSchedule.entity';

export type ConsultationScheduleFilterType = {
  consultationTypes?: string[] | null;
  consultationStatuses?: string[] | null;
  dateRanges?: DateRangeFilter | null;
  builder: SelectQueryBuilder<ConsultationSchedule>;
};
