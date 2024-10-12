import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoleResponse } from './roleResponse.dto';

@ObjectType({ isAbstract: true })
export class UserResponse {
  @Field(_type => ID)
  id: string;

  @Field(_type => String)
  email: string;

  @Field(_type => String)
  firstName: string;

  @Field(_type => String)
  lastName: string;

  @Field(_type => String)
  fullName: string;

  @Field(_type => RoleResponse)
  role: RoleResponse;
}
