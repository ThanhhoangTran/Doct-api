import { CONSULTATION_TYPE, ENUM_TYPE } from '../../../../common/constants';
import { PatientInfoJson } from '../../../../common/dtos/requests/patientInfoJson.dto';
import { UserContextInterface } from '../../../../common/interface';

export type CreateConsultationScheduleInput = {
  startTime: Date;
  endTime: Date;
  consultationType: ENUM_TYPE<typeof CONSULTATION_TYPE>;
  timeOpeningId: string;
  patientInfo: PatientInfoJson;
  userCtx: UserContextInterface;
};
