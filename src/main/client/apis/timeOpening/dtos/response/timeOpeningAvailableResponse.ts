import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimeOpeningRangeAvailableResponse {
  @Field(_type => Date)
  date: Date;

  @Field(_type => [AvailableTimeResponse], { nullable: true })
  meetings: AvailableTimeResponse[];

  @Field(_type => [AvailableTimeResponse], { nullable: true })
  operations: AvailableTimeResponse[];

  @Field(_type => [AvailableTimeResponse], { nullable: true })
  appointments: AvailableTimeResponse[];
}

@ObjectType()
export class AvailableTimeResponse {
  @Field(_type => Date)
  startTime: Date;

  @Field(_type => Date)
  endTime: Date;
}
