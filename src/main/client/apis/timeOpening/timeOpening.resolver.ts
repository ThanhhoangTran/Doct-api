import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpsertScheduleTimingEventInputType } from './dtos/inputs/upsertScheduleTimingEventInput.dto';
import { TimeOpeningRangeAvailableResponse } from './dtos/responses/timeOpeningAvailableResponse';
import { Auth } from '../../../../common/decorators/auth.decorator';
import { ROLE_NAME } from '../../../../common/constants';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { UserContext } from '../../../../common/decorators/user.decorator';
import { IUseCase, UserContextInterface } from '../../../../common/interface';
import { TimeOpening } from '../../../../entities/timeOpening.entity';
import { GetPagingTimeOpeningResponse } from './dtos/responses/getPagingTimeOpeningResponse';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { GetTimeOpeningRangesAvailableInputType } from './dtos/inputs/getTimeOpeningRangesAvailableInput.dto';
import { Inject } from '@nestjs/common';
import { UpsertScheduleTimingEventUseCase } from '../../../../useCases/timeOpening/upsertScheduleTimingEvent/usecase';
import { UpsertScheduleTimingEventInput } from '../../../../useCases/timeOpening/upsertScheduleTimingEvent/types/input';
import { GetPagingTimeOpeningsUseCase } from '../../../../useCases/timeOpening/getPagingTimeOpenings/usecase';
import { GetPagingTimeOpeningInput } from '../../../../useCases/timeOpening/getPagingTimeOpenings/types/input';
import { GetAvailableTimeOpeningRangesUseCase } from '../../../../useCases/timeOpening/getAvailableTimeOpeningRanges/usecase';
import { GetAvailableTimeOpeningRangesInput } from '../../../../useCases/timeOpening/getAvailableTimeOpeningRanges/types/input';

@Auth(['Roles'])
@Resolver(() => TimeOpening)
export class TimeOpeningResolver {
  constructor(
    @Inject(UpsertScheduleTimingEventUseCase) private readonly _upsertScheduleTimingEvent: IUseCase<UpsertScheduleTimingEventInput, TimeOpening>,
    @Inject(GetPagingTimeOpeningsUseCase) private readonly _getPagingTimeOpenings: IUseCase<GetPagingTimeOpeningInput, GetPagingTimeOpeningResponse>,
    @Inject(GetAvailableTimeOpeningRangesUseCase) private readonly _getAvailableTimeOpeningRanges: IUseCase<GetAvailableTimeOpeningRangesInput, TimeOpeningRangeAvailableResponse>,
  ) {}

  @Roles(ROLE_NAME.DOCTOR, ROLE_NAME.PATIENT)
  @Mutation(_type => TimeOpening)
  async upsertScheduleTimingEvent(@Args('input') input: UpsertScheduleTimingEventInputType, @UserContext() currentUser: UserContextInterface): Promise<TimeOpening> {
    return await this._upsertScheduleTimingEvent.execute({
      ...input,
      userCtx: currentUser,
    });
  }

  @Query(_type => GetPagingTimeOpeningResponse)
  async getPagingScheduleTimingEvents(@Args('pagination') pagination: PaginationDto, @UserContext() currentUser: UserContextInterface): Promise<GetPagingTimeOpeningResponse> {
    return await this._getPagingTimeOpenings.execute({
      pagination,
      userCtx: currentUser,
    });
  }

  @Roles(ROLE_NAME.DOCTOR)
  @Query(_type => TimeOpeningRangeAvailableResponse)
  async getTimeOpeningRangesAvailable(
    @Args('input') input: GetTimeOpeningRangesAvailableInputType,
    @UserContext() currentUser: UserContextInterface,
  ): Promise<TimeOpeningRangeAvailableResponse> {
    return await this._getAvailableTimeOpeningRanges.execute({
      ...input,
      userCtx: currentUser,
    });
  }
}
