import { CustomBaseEntity } from '@/common/baseEntity';
import { EVENT_TYPE } from '@/common/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'enum', enum: EVENT_TYPE })
  event: string;

  @Column({ type: 'uuid' })
  userId: string;
}
