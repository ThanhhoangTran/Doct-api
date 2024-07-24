import { CustomResponseFields } from '@/common/interface';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetRoles extends CustomResponseFields {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  description: string;
}
