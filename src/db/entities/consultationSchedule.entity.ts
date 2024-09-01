import { CustomBaseEntity } from '@/common/baseEntity';
import { CONSULTATION_STATUS, CONSULTATION_TYPE } from '@/common/constants';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType({ isAbstract: true })
@Entity({
  name: 'consultation_schedule',
})
export class ConsultationSchedule extends CustomBaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(_type => Date)
  @Column({ type: 'timestamp with time zone', nullable: true })
  startTime: Date;

  @Field(_type => Date)
  @Column({ type: 'timestamp with time zone', nullable: true })
  endTime: Date;

  @Field(_type => String)
  @Column({ type: 'enum', enum: CONSULTATION_TYPE })
  consultationType: string;

  @Field(_type => ID)
  @Column({ type: 'uuid' })
  timeOpeningId: string;

  @Column({ type: 'jsonb', nullable: true })
  patientInfo: string;

  @Field(_type => String)
  @Column({ type: 'varchar', length: 100 })
  meetingUrl: string;

  @Field(_type => String)
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Field(_type => String)
  @Column({ type: 'enum', enum: CONSULTATION_STATUS })
  status: string;
}
