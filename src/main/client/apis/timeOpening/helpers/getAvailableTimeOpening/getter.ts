import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { TimeOpening } from '../../../../../../entities/timeOpening.entity';
import { EVENT_TYPE } from '../../../../../../common/constants';
import { SyncGetter } from '../../../../../../common/interface';
import { GetAvailableTimeOpeningHelperOutput } from './types/output';
import { GetAvailableTimeOpeningHelperInput } from './types/input';

@Injectable()
export class GetAvailableTimeOpeningHelperImpl implements SyncGetter<GetAvailableTimeOpeningHelperInput, GetAvailableTimeOpeningHelperOutput> {
  execute({ timeOpening }: GetAvailableTimeOpeningHelperInput): GetAvailableTimeOpeningHelperOutput {
    const availableScheduleTimes = [];
    const availableMeetings = [];
    const availableOperations = [];
    switch (timeOpening.event) {
      case EVENT_TYPE.APPOINTMENT:
        const markedSchedules = timeOpening?.consultationSchedules?.map(consultation => ({ startTime: consultation.startTime, endTime: consultation.endTime }));
        availableScheduleTimes.push(...this.getAvailableSchedules(timeOpening, markedSchedules));
        break;
    }

    return { availableAppointments: availableScheduleTimes, availableMeetings, availableOperations };
  }

  private getAvailableSchedules(timeOpening: TimeOpening, markedSchedules?: Array<{ startTime: Date; endTime: Date }>): Array<{ startTime: Date; endTime: Date }> {
    let startTime = timeOpening.startOpening;
    const endTime = timeOpening.endOpening;
    const availableTimes = [];

    if (!markedSchedules?.length) {
      availableTimes.push({
        startTime,
        endTime,
      });

      return availableTimes;
    }

    for (const schedule of markedSchedules) {
      if (dayjs(startTime).isSame(schedule.startTime)) {
        startTime = schedule.endTime;
        continue;
      }

      if (dayjs(startTime).isBefore(schedule.startTime)) {
        availableTimes.push({
          startTime,
          endTime: schedule.startTime,
        });

        startTime = schedule.endTime;
        continue;
      }
    }

    //handle for lasted schedule
    if (dayjs(startTime).isBefore(endTime)) {
      availableTimes.push({
        startTime,
        endTime,
      });
    }

    return availableTimes;
  }
}
