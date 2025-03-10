import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignInDto {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
