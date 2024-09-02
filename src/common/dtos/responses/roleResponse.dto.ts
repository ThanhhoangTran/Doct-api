import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RoleResponse {
  @Field(_type => ID)
  id: string;

  @Field(_type => String)
  name: string;

  @Field(_type => String)
  description: string;
}
