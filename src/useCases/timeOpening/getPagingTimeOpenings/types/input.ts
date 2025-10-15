import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { UserContextInterface } from '../../../../common/interface';

export type GetPagingTimeOpeningInput = {
  pagination: PaginationDto;
  userCtx: UserContextInterface;
};
