import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType({ isAbstract: true })
@Entity('token')
export class Token extends BaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(_type => ID)
  @Column()
  userId: string;

  @Field(_type => String, { nullable: true })
  @Column()
  accessToken: string;

  @Field(_type => String, { nullable: true })
  @Column()
  refreshToken: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  lastUsed: Date;
}
