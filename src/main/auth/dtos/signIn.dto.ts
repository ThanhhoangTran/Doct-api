import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SignInDto {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
