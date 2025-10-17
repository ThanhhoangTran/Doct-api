import { CONSULTATION_STATUS, ENUM_TYPE } from '../../../../common/constants';
import { UserContextInterface } from '../../../../common/interface';

export type ChangeConsultationStatusInput = {
  consultationScheduleId: string;
  status: ENUM_TYPE<typeof CONSULTATION_STATUS>;
  userCtx: UserContextInterface;
  startTime?: Date;
  endTime?: Date;
};
