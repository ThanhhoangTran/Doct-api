import { Field, ID, InputType } from '@nestjs/graphql';
import { IsDateString, IsEnum, IsUUID } from 'class-validator';
import { CONSULTATION_STATUS, ENUM_TYPE } from '../../../../../../common/constants';

@InputType()
export class ChangeConsultationStatusInputType {
  @Field(_type => ID)
  @IsUUID()
  consultationScheduleId: string;

  @Field(_type => CONSULTATION_STATUS)
  @IsEnum(CONSULTATION_STATUS)
  status: ENUM_TYPE<typeof CONSULTATION_STATUS>;

  @Field(_type => Date, { nullable: true })
  @IsDateString()
  startTime?: Date;

  @Field(_type => Date, { nullable: true })
  @IsDateString()
  endTime?: Date;
}
