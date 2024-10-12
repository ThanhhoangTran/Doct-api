import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export class TimeOpeningRangeAvailableResponse {
  @Field(_type => String)
  date: string;

  @Field(_type => [AvailableTimeResponse], { nullable: true })
  meetings: AvailableTimeResponse[];

  @Field(_type => [AvailableTimeResponse], { nullable: true })
  operations: AvailableTimeResponse[];

  @Field(_type => [AvailableTimeResponse], { nullable: true })
  appointments: AvailableTimeResponse[];
}

@ObjectType({ isAbstract: true })
export class AvailableTimeResponse {
  @Field(_type => Date)
  startTime: Date;

  @Field(_type => Date)
  endTime: Date;
}
