import { Inject, Injectable } from '@nestjs/common';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { GetAvailableTimeOpeningRangesInput } from './types/input';
import dayjs from 'dayjs';
import { UserInputError } from '@nestjs/apollo';
import { ErrorMessage } from '../../../errorMessages';
import { TimeOpeningRepository } from '../../../repositories/timeOpening.repository';
import { TimeOpeningRangeAvailableResponse } from '../../../main/client/apis/timeOpening/dtos/responses/timeOpeningAvailableResponse';
import { GetAvailableTimeOpeningHelperImpl } from '../../../main/client/apis/timeOpening/helpers/getAvailableTimeOpening/getter';
import { SyncGetter } from '../../../common/interface';
import { GetAvailableTimeOpeningHelperInput } from '../../../main/client/apis/timeOpening/helpers/getAvailableTimeOpening/types/input';
import { GetAvailableTimeOpeningHelperOutput } from '../../../main/client/apis/timeOpening/helpers/getAvailableTimeOpening/types/output';

@Injectable()
export class GetAvailableTimeOpeningRangesUseCase extends UseCaseAbstraction<GetAvailableTimeOpeningRangesInput, TimeOpeningRangeAvailableResponse> {
  constructor(
    private readonly _timeOpeningRepo: TimeOpeningRepository,
    @Inject(GetAvailableTimeOpeningHelperImpl)
    private readonly _getAvailableTimeOpeningHelper: SyncGetter<GetAvailableTimeOpeningHelperInput, GetAvailableTimeOpeningHelperOutput>,
  ) {
    super();
  }

  protected async executeLogic(input: GetAvailableTimeOpeningRangesInput, _validatedResult: void): Promise<TimeOpeningRangeAvailableResponse> {
    const { userCtx, startDate, endDate, filterByOpeningType } = input;

    if (dayjs(startDate).isAfter(endDate)) {
      throw new UserInputError(ErrorMessage.TIME_OPENING.INVALID_DATE_RANGE);
    }

    const openingRangeTimeBuilder = this._timeOpeningRepo.getOpeningByRangeTimeBuilder({ startTime: startDate, endTime: endDate, userId: userCtx.id });

    if (filterByOpeningType) openingRangeTimeBuilder.andWhere('TimeOpening.event = :eventType', { eventType: filterByOpeningType });

    const openingTimeByRanges = await openingRangeTimeBuilder.orderBy('TimeOpening.startOpening').getMany();
    if (!openingTimeByRanges.length) {
      return undefined;
    }

    //order by consultation_schedules by start_time => not exist case overlaps

    const timeOpeningRangeAvailable: Omit<TimeOpeningRangeAvailableResponse, 'date'> = {
      meetings: [],
      appointments: [],
      operations: [],
    };

    for (const openingTime of openingTimeByRanges) {
      const { availableAppointments, availableMeetings, availableOperations } = this._getAvailableTimeOpeningHelper.execute({ timeOpening: openingTime });

      timeOpeningRangeAvailable.appointments.push(...availableAppointments);
      timeOpeningRangeAvailable.meetings.push(...availableMeetings);
      timeOpeningRangeAvailable.operations.push(...availableOperations);
    }

    return timeOpeningRangeAvailable;
  }
}
