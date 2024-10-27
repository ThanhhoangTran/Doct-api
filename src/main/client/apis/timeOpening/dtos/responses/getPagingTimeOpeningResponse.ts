import { ObjectType } from '@nestjs/graphql';
import { PaginationResponse } from '../../../../../../common/response';
import { TimeOpening } from '../../../../../../entities/timeOpening.entity';

@ObjectType({ isAbstract: true })
export class GetPagingTimeOpeningResponse extends PaginationResponse<TimeOpening>(TimeOpening) {}
