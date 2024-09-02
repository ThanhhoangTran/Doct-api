import { Injectable } from '@nestjs/common';
import { ScheduleTimingEventValidator } from '../abstractions/scheduleTimingEventValidator';
import { UserInputError } from '@nestjs/apollo';
import { messageKey } from '@/i18n';
import { TimeOpeningRepository } from '@/db/repositories/timeOpening.repository';

@Injectable()
export class ScheduleTimingEventValidatorImpl implements ScheduleTimingEventValidator {
  constructor(private readonly timeOpeningRepo: TimeOpeningRepository) {}

  async validateOverlapTimingEvent({
    startTime,
    endTime,
    userId,
    excludeTimeOpeningIds,
  }: {
    startTime: Date;
    endTime: Date;
    userId: string;
    excludeTimeOpeningIds?: string[];
  }): Promise<void> {
    if (startTime >= endTime) {
      throw new UserInputError(messageKey.TIME_OPENING.START_OPENING_CANNOT_GREATER_THAN_END_OPENING);
    }

    const isOverlapSchedule = await this.timeOpeningRepo.isOverlapSchedule({ userId, startOpening: startTime, endOpening: endTime, excludeTimeOpeningIds });
    if (isOverlapSchedule) {
      throw new UserInputError(messageKey.TIME_OPENING.OVERLAPS_TIME_OPENING);
    }
  }
}
