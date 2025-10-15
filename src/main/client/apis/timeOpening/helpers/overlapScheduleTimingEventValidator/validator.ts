import { Injectable } from '@nestjs/common';
import { Getter } from '../../../../../../common/interface';
import { OverlapScheduleTimingEventValidatorInput } from './types/input';
import { ErrorMessage } from '../../../../../../errorMessages';
import { UserInputError } from '@nestjs/apollo';
import { TimeOpeningRepository } from '../../../../../../repositories/timeOpening.repository';

@Injectable()
export class OverlapScheduleTimingEventValidatorImpl implements Getter<OverlapScheduleTimingEventValidatorInput> {
  constructor(private readonly _timeOpeningRepo: TimeOpeningRepository) {}

  async execute(input: OverlapScheduleTimingEventValidatorInput): Promise<void> {
    const { startTime, endTime, userId, excludeTimeOpeningIds } = input;

    if (startTime >= endTime) {
      throw new UserInputError(ErrorMessage.TIME_OPENING.START_OPENING_CANNOT_GREATER_THAN_END_OPENING);
    }

    const isOverlapSchedule = await this._timeOpeningRepo.isOverlapSchedule({ userId, startOpening: startTime, endOpening: endTime, excludeTimeOpeningIds });
    if (isOverlapSchedule) {
      throw new UserInputError(ErrorMessage.TIME_OPENING.OVERLAPS_TIME_OPENING);
    }
  }
}
