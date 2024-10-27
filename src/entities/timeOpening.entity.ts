import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConsultationSchedule } from './consultationSchedule.entity';
import { CustomBaseEntity } from '../common/baseEntity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EVENT_TYPE } from '../common/constants';

@Entity({
  name: 'time_opening',
})
@ObjectType({ isAbstract: true })
export class TimeOpening extends CustomBaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(_type => Date, { nullable: true })
  @Column({ type: 'timestamp with time zone', nullable: true })
  startOpening: Date;

  @Field(_type => Date, { nullable: true })
  @Column({ type: 'timestamp with time zone', nullable: true })
  endOpening: Date;

  @Field(_type => EVENT_TYPE)
  @Column({ type: 'varchar' })
  event: string;

  @Field(_type => ID)
  @Column({ type: 'uuid' })
  userId: string;

  @Field(_type => [ConsultationSchedule])
  @OneToMany(_type => ConsultationSchedule, schedule => schedule.timeOpening)
  consultationSchedules: ConsultationSchedule[];
}
