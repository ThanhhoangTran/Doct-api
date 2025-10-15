import { CONSULTATION_STATUS, CONSULTATION_TYPE, ENUM_TYPE } from '../../../../common/constants';
import { PatientInfoJson } from '../../../../common/dtos/requests/patientInfoJson.dto';
import { UserContextInterface } from '../../../../common/interface';

export type UpsertConsultationScheduleInput = {
  id: string;
  startTime: Date;
  endTime: Date;
  consultationType: ENUM_TYPE<typeof CONSULTATION_TYPE>;
  timeOpeningId: string;
  patientInfo: PatientInfoJson;
  patientId: string;
  status: ENUM_TYPE<typeof CONSULTATION_STATUS>;
  userCtx: UserContextInterface;
};
