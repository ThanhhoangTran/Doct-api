import { Inject, Injectable } from '@nestjs/common';
import { UpsertScheduleTimingEventInput } from './dtos/inputs/scheduleTimingEventInput.dto';
import { UserContextInterface } from '@/common/interface';
import { TimeOpeningRepository } from '@/db/repositories/timeOpening.repository';
import { UserInputError } from '@nestjs/apollo';
import { messageKey } from '@/i18n';
import { TimeOpeningsResponse } from './dtos/response/timeOpeningsResponse';
import { BaseQueryFilterDto } from '@/common/dtos/queryFilter.dto';
import { BuilderPaginationResponse, notUndefined } from '@/common/utilFunction';
import { ScheduleTimingEventValidatorImpl } from './helpers/implementations/scheduleTimingEventValidatorImpl';
import { ScheduleTimingEventValidator } from './helpers/abstractions/scheduleTimingEventValidator';

@Injectable()
export class TimeOpeningService {
  constructor(
    private readonly timeOpeningRepo: TimeOpeningRepository,
    @Inject(ScheduleTimingEventValidatorImpl) private readonly scheduleTimingEventValidator: ScheduleTimingEventValidator,
  ) {}

  async upsertScheduleTimingEvent(input: UpsertScheduleTimingEventInput, currentUser: UserContextInterface) {
    const { id, ...rest } = input;
    const existingTimeOpening = id ? await this.timeOpeningRepo.findOne({ where: { id } }) : undefined;
    if (id && !existingTimeOpening) {
      throw new UserInputError(messageKey.TIME_OPENING.TIME_OPENING_NOT_FOUND);
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

  async getScheduleTimingEvents(queryParams: BaseQueryFilterDto, currentUser: UserContextInterface): Promise<TimeOpeningsResponse> {
    const builder = this.timeOpeningRepo.createQueryBuilder().where({ userId: currentUser.id });
    return new BuilderPaginationResponse<TimeOpeningsResponse>(builder, queryParams).execute();
  }
}
