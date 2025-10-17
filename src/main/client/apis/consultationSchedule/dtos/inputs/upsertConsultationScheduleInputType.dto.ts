import { Field, ID, InputType } from '@nestjs/graphql';
import { CONSULTATION_TYPE } from '../../../../../../common/constants';
import { PatientInfoJson } from '../../../../../../common/dtos/requests/patientInfoJson.dto';

@InputType()
export class CreateConsultationScheduleInputType {
  @Field(_type => Date)
  startTime: Date;

  @Field(_type => Date)
  endTime: Date;

  @Field(_type => CONSULTATION_TYPE, { defaultValue: CONSULTATION_TYPE.VIDEO })
  consultationType: string;

  @Field(_type => ID)
  timeOpeningId: string;

  @Field(_type => PatientInfoJson)
  patientInfo: PatientInfoJson;
}
