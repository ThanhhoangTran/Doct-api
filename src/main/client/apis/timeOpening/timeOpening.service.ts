import { Inject, Injectable } from '@nestjs/common';
import { UpsertScheduleTimingEventInput } from './dtos/inputs/upsertScheduleTimingEventInput.dto';
import { UserInputError } from '@nestjs/apollo';
import { ScheduleTimingEventValidatorImpl } from './helpers/implementations/scheduleTimingEventValidatorImpl';
import { ScheduleTimingEventValidator } from './helpers/abstractions/scheduleTimingEventValidator';
import { GetTimeOpeningRangesAvailableInput } from './dtos/inputs/getTimeOpeningRangesAvailableInput.dto';
import { TimeOpeningRangeAvailableResponse } from './dtos/responses/timeOpeningAvailableResponse';
import dayjs from 'dayjs';
import { GetAvailableTimeOpeningHelperImpl } from './helpers/implementations/getAvailableTimeOpeningHelperImpl';
import { GetAvailableTimeOpeningHelper } from './helpers/abstractions/getAvailableTimeOpeningHelper';
import { TimeOpeningRepository } from '../../../../repositories/timeOpening.repository';
import { UserContextInterface } from '../../../../common/interface';
import { BuilderPaginationResponse, notUndefined } from '../../../../utils/utilFunction';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { ErrorMessage } from '../../../../i18n';
import { GetPagingTimeOpeningResponse } from './dtos/responses/getPagingTimeOpeningResponse';
@Injectable()
export class TimeOpeningService {
  public constructor(
    private readonly timeOpeningRepo: TimeOpeningRepository,
    @Inject(ScheduleTimingEventValidatorImpl) private readonly scheduleTimingEventValidator: ScheduleTimingEventValidator,
    @Inject(GetAvailableTimeOpeningHelperImpl) private readonly getAvailableTimeOpeningHelper: GetAvailableTimeOpeningHelper,
  ) {}

  async upsertScheduleTimingEvent(input: UpsertScheduleTimingEventInput, currentUser: UserContextInterface) {
    const { id, ...rest } = input;
    const existingTimeOpening = id ? await this.timeOpeningRepo.findOne({ where: { id } }) : undefined;
    if (id && !existingTimeOpening) {
      throw new UserInputError(ErrorMessage.TIME_OPENING.TIME_OPENING_NOT_FOUND);
    }

    await this.scheduleTimingEventValidator.validateOverlapTimingEvent({
      startTime: rest.startOpening,
      endTime: rest.endOpening,
      userId: currentUser.id,
      excludeTimeOpeningIds: [id].filter(notUndefined),
    });

    const timeOpening = this.timeOpeningRepo.merge(existingTimeOpening ?? this.timeOpeningRepo.create({ userId: currentUser.id }), { ...rest, event: rest.eventType });
    return await this.timeOpeningRepo.save(timeOpening);
  }

  async getScheduleTimingEvents(pagination: PaginationDto, currentUser: UserContextInterface): Promise<GetPagingTimeOpeningResponse> {
    const builder = this.timeOpeningRepo.createQueryBuilder().where({ userId: currentUser.id });
    return new BuilderPaginationResponse<GetPagingTimeOpeningResponse>(builder, pagination).execute();
  }

  async getTimeOpeningRangesAvailable(input: GetTimeOpeningRangesAvailableInput, currentUser: UserContextInterface): Promise<TimeOpeningRangeAvailableResponse[] | undefined> {
    const { startDate, endDate, filterByOpeningType } = input;

    if (dayjs(startDate).isAfter(endDate)) {
      throw new UserInputError(ErrorMessage.TIME_OPENING.INVALID_DATE_RANGE);
    }

    const openingRangeTimeBuilder = this.timeOpeningRepo.getOpeningByRangeTimeBuilder({ startTime: startDate, endTime: endDate, userId: currentUser.id });

    if (filterByOpeningType) openingRangeTimeBuilder.andWhere('TimeOpening.event = :eventType', { eventType: filterByOpeningType });

    const openingTimeByRanges = await openingRangeTimeBuilder.orderBy('TimeOpening.startOpening').getMany();
    if (!openingTimeByRanges.length) {
      return undefined;
    }

    const timeOpeningRangeAvailable: Record<string, Omit<TimeOpeningRangeAvailableResponse, 'date'>> = {};

    //order by consultation_schedules by start_time => not exist case overlaps

    for (const openingTime of openingTimeByRanges) {
      const { formattedDate, availableAppointments, availableMeetings, availableOperations } = this.getAvailableTimeOpeningHelper.execute(openingTime);
      if (!timeOpeningRangeAvailable[formattedDate]) {
        timeOpeningRangeAvailable[formattedDate] = {
          appointments: availableAppointments,
          meetings: availableMeetings,
          operations: availableOperations,
        };
      } else {
        timeOpeningRangeAvailable[formattedDate].appointments.push(...availableAppointments);
        timeOpeningRangeAvailable[formattedDate].meetings.push(...availableMeetings);
        timeOpeningRangeAvailable[formattedDate].operations.push(...availableOperations);
      }
    }

    return Object.keys(timeOpeningRangeAvailable).map(formattedDate => ({
      date: formattedDate,
      ...timeOpeningRangeAvailable[formattedDate],
    }));
  }
}
