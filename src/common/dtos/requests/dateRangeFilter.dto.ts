import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DateRangeFilter {
  @Field(_type => Date)
  startDate: Date;

  @Field(_type => Date)
  endDate: Date;
}
