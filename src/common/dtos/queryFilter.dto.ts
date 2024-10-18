import { Field, InputType } from '@nestjs/graphql';
import { QUERY_OPERATORS } from '../constants';

@InputType('FilterDto', { isAbstract: true })
export class FilterDto {
  @Field(_type => String)
  field: string;

  @Field(_type => String)
  data: string;

  @Field(_type => String, { defaultValue: QUERY_OPERATORS.EQUAL })
  operator: string;
}

@InputType('BaseQueryFilterDto', { isAbstract: true })
export class BaseQueryFilterDto {
  @Field(_type => Number, { defaultValue: 10, nullable: true })
  pageSize?: number = 10;

  @Field(_type => Number, { defaultValue: 1, nullable: true })
  pageNumber?: number = 1;

  @Field(_type => FilterDto, { nullable: true })
  filter?: FilterDto;

  @Field(_type => String, { nullable: true })
  q?: string;
}
