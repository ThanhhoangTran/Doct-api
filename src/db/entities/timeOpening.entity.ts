import { CustomBaseEntity } from '@/common/baseEntity';
import { EVENT_TYPE } from '@/common/constants';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType({ isAbstract: true })
@Entity({
  name: 'time_opening',
})
export class TimeOpening extends CustomBaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(_type => Date)
  @Column({ type: 'timestamp with time zone', nullable: true })
  startOpening: Date;

  @Field(_type => Date)
  @Column({ type: 'timestamp with time zone', nullable: true })
  endOpening: string;

  @Field(_type => String)
  @Column({ type: 'enum', enum: EVENT_TYPE })
  event: string;

  @Field(_type => ID)
  @Column({ type: 'uuid' })
  userId: string;
}
