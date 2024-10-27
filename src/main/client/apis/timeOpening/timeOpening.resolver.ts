import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TimeOpeningService } from './timeOpening.service';
import { UpsertScheduleTimingEventInput } from './dtos/inputs/upsertScheduleTimingEventInput.dto';
import { TimeOpeningRangeAvailableResponse } from './dtos/responses/timeOpeningAvailableResponse';
import { GetTimeOpeningRangesAvailableInput } from './dtos/inputs/getTimeOpeningRangesAvailableInput.dto';
import { Auth } from '../../../../common/decorators/auth.decorator';
import { ROLE_NAME } from '../../../../common/constants';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserContext } from '../../../../common/decorators/user.decorator';
import { UserContextInterface } from '../../../../common/interface';
import { TimeOpening } from '../../../../entities/timeOpening.entity';
import { GetPagingTimeOpeningResponse } from './dtos/responses/getPagingTimeOpeningResponse';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';

@Auth(['Roles'])
@Resolver(() => TimeOpening)
export class TimeOpeningResolver {
  constructor(private readonly timeOpeningService: TimeOpeningService) {}

  @Roles(ROLE_NAME.DOCTOR, ROLE_NAME.PATIENT)
  @Mutation(_type => TimeOpening)
  async upsertScheduleTimingEvent(@Args('input') input: UpsertScheduleTimingEventInput, @UserContext() currentUser: UserContextInterface) {
    return await this.timeOpeningService.upsertScheduleTimingEvent(input, currentUser);
  }

  @Query(_type => GetPagingTimeOpeningResponse)
  async getScheduleTimingEvents(@Args('pagination') pagination: PaginationDto, @UserContext() currentUser: UserContextInterface): Promise<GetPagingTimeOpeningResponse> {
    return await this.timeOpeningService.getScheduleTimingEvents(pagination, currentUser);
  }

  @Roles(ROLE_NAME.DOCTOR)
  @Query(_type => [TimeOpeningRangeAvailableResponse], { nullable: true })
  async getTimeOpeningRangesAvailable(
    @Args('input') input: GetTimeOpeningRangesAvailableInput,
    @UserContext() currentUser: UserContextInterface,
  ): Promise<TimeOpeningRangeAvailableResponse[] | undefined> {
    return await this.timeOpeningService.getTimeOpeningRangesAvailable(input, currentUser);
  }
}
