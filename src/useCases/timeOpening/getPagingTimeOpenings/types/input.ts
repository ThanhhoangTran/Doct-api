import { ENUM_TYPE, EVENT_TYPE } from '../../../../common/constants';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { DateRangeFilter } from '../../../../common/dtos/requests/dateRangeFilter.dto';
import { UserContextInterface } from '../../../../common/interface';

type GetPagingTimeOpeningFilter = {
  dateRange?: DateRangeFilter | null;
  eventType?: ENUM_TYPE<typeof EVENT_TYPE> | null;
};

export type GetPagingTimeOpeningInput = {
  pagination: PaginationDto;
  filter?: GetPagingTimeOpeningFilter | null;
  userCtx: UserContextInterface;
};
