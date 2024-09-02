import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserContext } from '@/common/decorators/user.decorator';
import { UserContextInterface } from '@/common/interface';
import { TimeOpeningService } from './timeOpening.service';
import { UpsertScheduleTimingEventInput } from './dtos/inputs/scheduleTimingEventInput.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { ROLE_NAME } from '@/common/constants';
import { Auth } from '@/common/decorators/auth.decorator';
import { TimeOpeningResponse } from '@/common/dtos/responses/timingOpeningResponse.dto';
import { TimeOpeningsResponse } from './dtos/response/timeOpeningsResponse';
import { BaseQueryFilterDto } from '@/common/dtos/queryFilter.dto';

@Auth(['Roles'])
@Resolver()
export class TimeOpeningResolver {
  constructor(private readonly timeOpeningService: TimeOpeningService) {}

  @Roles(ROLE_NAME.PATIENT)
  @Mutation(_type => TimeOpeningResponse)
  async upsertScheduleTimingEvent(@Args('input') input: UpsertScheduleTimingEventInput, @UserContext() currentUser: UserContextInterface) {
    return this.timeOpeningService.upsertScheduleTimingEvent(input, currentUser);
  }

  @Query(_type => TimeOpeningsResponse)
  async getScheduleTimingEvents(@Args('queryParams') queryParams: BaseQueryFilterDto, @UserContext() currentUser: UserContextInterface): Promise<TimeOpeningsResponse> {
    return this.timeOpeningService.getScheduleTimingEvents(queryParams, currentUser);
  }
}
