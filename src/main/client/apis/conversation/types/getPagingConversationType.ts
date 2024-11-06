import { PaginationDto } from '../../../../../common/dtos/queryFilter.dto';
import { UserContextInterface } from '../../../../../common/interface';

export type GetPagingConversationType = {
  pagination: PaginationDto;
  user: UserContextInterface;
};
