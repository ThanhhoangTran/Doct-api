import { User } from '@/db/entities/user.entity';
import { Field, ObjectType, PickType } from '@nestjs/graphql';

@ObjectType()
export class SignInResponse extends PickType(User, ['id', 'email', 'firstName', 'lastName', 'role', 'fullName']) {
  @Field(_type => String)
  token: string;

  @Field(_type => String)
  refreshToken: string;
}
