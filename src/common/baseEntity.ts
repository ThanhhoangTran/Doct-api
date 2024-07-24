import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CustomBaseEntity extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
