import { Field, InputType } from '@nestjs/graphql';
import { QUERY_OPERATORS } from '../constants';

@InputType()
export class FilterDto {
  @Field(_type => String)
  field: string;

  @Field(_type => String)
  data: string;

  @Field(_type => QUERY_OPERATORS, { defaultValue: QUERY_OPERATORS.EQUAL })
  operator: string;
}

@InputType()
export class PaginationDto {
  @Field(_type => Number, { defaultValue: 10, nullable: true })
  pageSize?: number = 10;

  @Field(_type => Number, { defaultValue: 1, nullable: true })
  pageNumber?: number = 1;
}
