import { ENUM_TYPE, EVENT_TYPE } from '../../../../common/constants';
import { UserContextInterface } from '../../../../common/interface';

export type UpsertScheduleTimingEventInput = {
  id?: string | null;
  eventType: ENUM_TYPE<typeof EVENT_TYPE>;
  startOpening: Date;
  endOpening: Date;
  userCtx: UserContextInterface;
};
