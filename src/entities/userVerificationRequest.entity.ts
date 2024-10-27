import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { USER_VERIFICATION_REQUEST_TYPE } from '../common/constants';
import { CustomBaseEntity } from '../common/baseEntity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'user_verification_request' })
@ObjectType({ isAbstract: true })
export class UserVerificationRequest extends CustomBaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(_type => String)
  @Column({ length: 50 })
  email: string;

  @Column({ type: 'jsonb', nullable: true })
  data: JSON;

  @Field(_type => Date)
  @Column({ type: 'date' })
  expirationTime: Date;

  @Field(_type => USER_VERIFICATION_REQUEST_TYPE)
  @Column({ type: 'varchar' })
  type: string;
}
