import { Field, InputType } from '@nestjs/graphql';
import { PaginationDto } from '../../../../../../common/dtos/queryFilter.dto';

@InputType()
export class GetPagingConversationInput {
  @Field(_type => PaginationDto)
  pagination: PaginationDto;
}
