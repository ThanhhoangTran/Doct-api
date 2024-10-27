import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class PatientInfoDto {
  @Field(_type => String)
  name: string;

  @Field(_type => String)
  email: string;

  @Field(_type => String)
  phoneNumber: string;

  @Field(_type => String)
  appointmentReason: string;
}
