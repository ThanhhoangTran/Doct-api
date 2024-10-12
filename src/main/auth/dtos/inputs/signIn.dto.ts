import { Field, InputType } from '@nestjs/graphql';

@InputType('SignInDto', { isAbstract: true })
export class SignInDto {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
