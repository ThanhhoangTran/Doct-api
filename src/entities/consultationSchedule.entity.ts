import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeOpening } from './timeOpening.entity';
import { CustomBaseEntity } from '../common/baseEntity';

@Entity({
  name: 'consultation_schedule',
})
export class ConsultationSchedule extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  endTime: Date;

  @Column({ type: 'varchar' })
  consultationType: string;

  @Column({ type: 'uuid' })
  timeOpeningId: string;

  @Column({ type: 'jsonb', nullable: true })
  patientInfo: string;

  @Column({ type: 'varchar', length: 100 })
  meetingUrl: string;

  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'varchar' })
  status: string;

  @ManyToOne(_type => TimeOpening, opening => opening.consultationSchedules)
  @JoinColumn({
    name: 'time_opening_id',
  })
  timeOpening: TimeOpening;
}
