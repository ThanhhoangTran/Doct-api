import { Field, ID, InputType } from '@nestjs/graphql';
import { CONSULTATION_STATUS, CONSULTATION_TYPE } from '../../../../../../common/constants';

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

  @Field(_type => ID, { nullable: true })
  patientId: string;

  @Field(_type => CONSULTATION_STATUS, { defaultValue: CONSULTATION_STATUS.WAITING })
  status: string;
}
