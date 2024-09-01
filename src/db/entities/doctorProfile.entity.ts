import { CustomBaseEntity } from '@/common/baseEntity';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType({ isAbstract: true })
@Entity({
  name: 'doctor_profile',
})
export class DoctorProfile extends CustomBaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(_type => Float, { defaultValue: 0 })
  @Column({ type: 'float', default: 0 })
  ratting: number;

  @Field(_type => ID)
  @Column({ type: 'uuid' })
  userId: string;
}
