import { TimeOpeningResponse } from '@/common/dtos/responses/timingOpeningResponse.dto';
import { PaginationResponse } from '@/common/response';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TimeOpeningsResponse extends PaginationResponse<TimeOpeningResponse>(TimeOpeningResponse) {}
