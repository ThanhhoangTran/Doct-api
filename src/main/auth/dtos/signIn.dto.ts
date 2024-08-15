import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SignInDto {
  @Field(() => String)
  username: string;
}
