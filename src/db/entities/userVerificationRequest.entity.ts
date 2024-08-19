import { CustomBaseEntity } from '@/common/baseEntity';
import { USER_VERIFICATION_REQUEST } from '@/common/constants';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_verification_request' })
export class UserVerificationRequest extends CustomBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  email: string;

  @Column({ type: 'jsonb', nullable: true })
  data: JSON;

  @Column({ type: 'date' })
  expirationTime: Date;

  @Column({ type: 'varchar' })
  type: USER_VERIFICATION_REQUEST;
}
