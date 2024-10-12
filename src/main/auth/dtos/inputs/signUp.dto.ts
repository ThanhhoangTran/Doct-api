import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
import { Match } from '../../../../common/decorators/match.decorator';

@InputType('SignUpDto', { isAbstract: true })
export class SignUpDto {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(8)
  password: string;

  @Field(() => String)
  @Match('password')
  confirmPassword: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  address: string;

  @Field(() => String, { name: 'roleType' })
  roleType: string;
}
