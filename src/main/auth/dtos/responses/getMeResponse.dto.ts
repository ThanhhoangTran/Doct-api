import { Field, ObjectType } from '@nestjs/graphql';
import { UserResponse } from '../../../../common/dtos/responses/userResponse.dto';

@ObjectType()
export class GetMeResponse extends UserResponse {
  @Field(_type => String)
  address: string;

  @Field(_type => String)
  phone: string;
}
