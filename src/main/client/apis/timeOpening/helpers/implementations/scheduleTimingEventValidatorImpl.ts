import { Injectable } from '@nestjs/common';
import { ScheduleTimingEventValidator } from '../abstractions/scheduleTimingEventValidator';
import { UserInputError } from '@nestjs/apollo';
import { TimeOpeningRepository } from '../../../../../../repositories/timeOpening.repository';
import { ErrorMessage } from '../../../../../../errorMessages';

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
      throw new UserInputError(ErrorMessage.TIME_OPENING.START_OPENING_CANNOT_GREATER_THAN_END_OPENING);
    }

    const isOverlapSchedule = await this.timeOpeningRepo.isOverlapSchedule({ userId, startOpening: startTime, endOpening: endTime, excludeTimeOpeningIds });
    if (isOverlapSchedule) {
      throw new UserInputError(ErrorMessage.TIME_OPENING.OVERLAPS_TIME_OPENING);
    }
  }
}
