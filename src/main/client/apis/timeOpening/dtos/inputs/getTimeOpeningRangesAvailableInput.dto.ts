import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetTimeOpeningRangesAvailableInput {
  @Field(_type => Date)
  startDate: Date;

  @Field(_type => Date, { nullable: true, defaultValue: new Date() })
  endDate: Date;

  @Field(_type => String, { nullable: true })
  filterByOpeningType?: string | null;
}
