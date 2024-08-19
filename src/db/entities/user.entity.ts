import { CustomBaseEntity } from '@/common/baseEntity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from './role.entity';

@ObjectType({ isAbstract: true })
@Entity({ name: 'user' })
export class User extends CustomBaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(_type => String)
  @Column('varchar', { length: 50 })
  firstName: string;

  @Field(_type => String)
  @Column('varchar', { length: 50 })
  lastName: string;

  @Field(_type => String)
  @Column('varchar')
  email: string;

  @Column('varchar', { select: false })
  password: string;

  @Field(_type => String)
  @Column('varchar')
  address: string;

  @Field(_type => String)
  @Column('varchar')
  phone: string;

  @Field(_type => String)
  fullName: string;

  @Field(_type => ID)
  @Column({ type: 'uuid' })
  roleId: string;

  @Field(_type => Role)
  @ManyToOne(_type => Role, role => role.id)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  // @Field(_type => [Role])
  // @ManyToMany(() => Role)
  // @JoinTable({
  //   name: 'user_role',
  //   joinColumn: {
  //     name: 'user_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'role_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // roles: Role[];
  @AfterLoad()
  loadFullName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
