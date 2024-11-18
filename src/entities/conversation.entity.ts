import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CustomBaseEntity } from '../common/baseEntity';
import { AttendeeDto } from '../common/dtos/responses/attendeesResponse.dto';

@Entity({ name: 'conversation' })
@ObjectType({ isAbstract: true })
export class Conversation extends CustomBaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(_type => String)
  @Column('varchar', {
    length: 100,
  })
  name: string;

  @Column({
    type: 'jsonb',
  })
  @Field(_type => [AttendeeDto], { nullable: true })
  attendees: AttendeeDto[];

  @Field(_type => ID)
  @Column('uuid')
  createdById: string;
}
