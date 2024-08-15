import { CustomBaseEntity } from '@/common/baseEntity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType({ isAbstract: true })
@Entity({
  name: 'role',
})
export class Role extends CustomBaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field((_type) => String)
  @Column('varchar', { length: 30 })
  name: string;

  @Field((_type) => String)
  @Column('varchar')
  description: string;
}
