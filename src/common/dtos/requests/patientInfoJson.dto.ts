import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PatientInfoJson {
  @Field(_type => String)
  name: string;

  @Field(_type => String)
  email: string;

  @Field(_type => String)
  phoneNumber: string;

  @Field(_type => String)
  appointmentReason: string;
}
