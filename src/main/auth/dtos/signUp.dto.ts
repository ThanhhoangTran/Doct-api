import { ROLE_NAME, ROLE_NAME_TYPE } from '@/common/constants';
import { Match } from '@/common/customDecorator/match.decorator';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, MinLength } from 'class-validator';

@InputType()
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

  @Field(() => ROLE_NAME, { name: 'roleType' })
  roleType: ROLE_NAME_TYPE;
}
