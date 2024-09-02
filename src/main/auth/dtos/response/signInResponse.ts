import { UserResponse } from '@/common/dtos/responses/userResponse.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignInResponse extends UserResponse {
  @Field(_type => String)
  token: string;

  @Field(_type => String)
  refreshToken: string;
}
