import { UserContextInterface } from '../../../../common/interface';

export type GetAvailableTimeOpeningRangesInput = {
  startDate: Date;
  endDate: Date;
  filterByOpeningType?: string | null;
  userCtx: UserContextInterface;
};
