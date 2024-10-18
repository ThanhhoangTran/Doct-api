import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConsultationSchedule } from './consultationSchedule.entity';
import { CustomBaseEntity } from '../common/baseEntity';

@Entity({
  name: 'time_opening',
})
export class TimeOpening extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startOpening: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  endOpening: Date;

  @Column({ type: 'varchar' })
  event: string;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToMany(_type => ConsultationSchedule, schedule => schedule.timeOpening)
  consultationSchedules: ConsultationSchedule[];
}
