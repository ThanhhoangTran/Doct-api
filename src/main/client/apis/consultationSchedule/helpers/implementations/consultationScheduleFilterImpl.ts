import { Brackets } from 'typeorm';
import { Getter } from '../../../../../../common/interface';
import { ConsultationScheduleFilterType } from '../../types/consultationScheduleFilterType';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsultationScheduleFilterImpl implements Getter<ConsultationScheduleFilterType> {
  execute(input: ConsultationScheduleFilterType): void | Promise<void> {
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
