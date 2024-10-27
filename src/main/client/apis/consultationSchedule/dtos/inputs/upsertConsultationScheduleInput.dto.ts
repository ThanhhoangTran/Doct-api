import { Field, ID, InputType } from '@nestjs/graphql';
import { CONSULTATION_STATUS, CONSULTATION_TYPE } from '../../../../../../common/constants';
import { PatientInfoJson } from '../../../../../../common/dtos/requests/patientInfoJson.dto';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class UpsertConsultationScheduleInput {
  @Field(_type => ID, { nullable: true })
  id: string;

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

  @Field(_type => ID, { nullable: true })
  patientId: string;

  @Field(_type => CONSULTATION_STATUS, { defaultValue: CONSULTATION_STATUS.WAITING })
  status: string;
}
