import { UserResponse } from '@/common/dtos/responses/userResponse.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetMeResponse extends UserResponse {
  @Field(_type => String)
  address: string;

  @Field(_type => String)
  phone: string;
}
