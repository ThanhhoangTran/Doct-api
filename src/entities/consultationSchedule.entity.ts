import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeOpening } from './timeOpening.entity';
import { CustomBaseEntity } from '../common/baseEntity';
import { User } from './user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CONSULTATION_STATUS, CONSULTATION_TYPE } from '../common/constants';
import { PatientInfoDto } from '../common/dtos/responses/patientInfoResponse.dto';

@Entity({
  name: 'consultation_schedule',
})
@ObjectType({ isAbstract: true })
export class ConsultationSchedule extends CustomBaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(_type => Date, { nullable: true })
  @Column({ type: 'timestamp with time zone', nullable: true })
  startTime: Date;

  @Field(_type => Date, { nullable: true })
  @Column({ type: 'timestamp with time zone', nullable: true })
  endTime: Date;

  @Field(_type => CONSULTATION_TYPE)
  @Column({ type: 'varchar' })
  consultationType: string;

  @Field(_type => ID)
  @Column({ type: 'uuid' })
  timeOpeningId: string;

  @Field(_type => PatientInfoDto, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  patientInfo: PatientInfoDto;

  @Field(_type => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  meetingUrl: string;

  @Field(_type => ID, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Field(_type => CONSULTATION_STATUS)
  @Column({ type: 'varchar' })
  status: string;

  @Field(_type => TimeOpening)
  @ManyToOne(_type => TimeOpening, opening => opening.consultationSchedules)
  @JoinColumn({
    name: 'time_opening_id',
  })
  timeOpening: TimeOpening;

  @Field(_type => User, { nullable: true })
  @ManyToOne(_type => User, { nullable: true })
  @JoinColumn({
    name: 'user_id',
  })
  patient: User;
}
