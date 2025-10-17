import { Field, InputType } from '@nestjs/graphql';
import { PaginationDto } from '../../../../../../common/dtos/queryFilter.dto';

@InputType()
export class GetPagingTimeOpeningInputType {
  @Field(_type => PaginationDto)
  pagination: PaginationDto;
}
