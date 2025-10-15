import { Brackets } from 'typeorm';
import { SyncGetter } from '../../../../../../common/interface';
import { Injectable } from '@nestjs/common';
import { ConsultationScheduleFilterType } from './types/input';

@Injectable()
export class ConsultationScheduleFilterImpl implements SyncGetter<ConsultationScheduleFilterType> {
  execute(input: ConsultationScheduleFilterType): void {
    const { builder, dateRanges, consultationStatuses, consultationTypes } = input;
    if (consultationStatuses?.length) {
      builder.andWhere('ConsultationSchedule.status IN (:...consultationStatuses)');
    }
    if (consultationTypes?.length) {
      builder.andWhere('ConsultationSchedule.consultationType IN (:...consultationTypes)');
    }
    if (dateRanges) {
      builder.andWhere(
        new Brackets(qb => {
          qb.where('ConsultationSchedule.startTime >= :startDate').andWhere('ConsultationSchedule.endTime <= :endDate');
        }),
      );
    }
    builder.setParameters({
      consultationStatuses: consultationStatuses ?? [],
      consultationTypes: consultationTypes ?? [],
      startDate: dateRanges?.startDate,
      endDate: dateRanges?.endDate,
    });
  }
}
