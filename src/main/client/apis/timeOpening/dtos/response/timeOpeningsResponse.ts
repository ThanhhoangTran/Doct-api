import { ObjectType } from '@nestjs/graphql';
import { PaginationResponse } from '../../../../../../common/response';
import { TimeOpeningResponse } from '../../../../../../common/dtos/responses/timingOpeningResponse.dto';

@ObjectType({ isAbstract: true })
export class TimeOpeningsResponse extends PaginationResponse<TimeOpeningResponse>(TimeOpeningResponse) {}
