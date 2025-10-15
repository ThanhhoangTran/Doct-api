import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { UserContextInterface } from '../../../../common/interface';
import { GetPagingConsultationScheduleFilter } from '../../../../main/client/apis/consultationSchedule/dtos/inputs/getPagingConsultationScheduleFilter.dto';

export type GetPagingConsultationScheduleInput = {
  pagination: PaginationDto;
  user: UserContextInterface;
  filter: GetPagingConsultationScheduleFilter;
};
