import { Field, ObjectType } from '@nestjs/graphql';
import { UserResponse } from '../../../../common/dtos/responses/userResponse.dto';

@ObjectType({ isAbstract: true })
export class SignInResponse extends UserResponse {
  @Field(_type => String)
  token: string;

  @Field(_type => String)
  refreshToken: string;
}
