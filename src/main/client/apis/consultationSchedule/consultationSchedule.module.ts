import { Module } from '@nestjs/common';
import { ConsultationScheduleResolver } from './consultationSchedule.resolver';
import { ConsultationScheduleFilterImpl } from './helpers/consultaionScheduleFilter/getter';
import { UpsertConsultationScheduleUseCase } from '../../../../useCases/consultationSchedule/upsertConsultationSchedules/usecase';
import { GetPagingConsultationScheduleUseCase } from '../../../../useCases/consultationSchedule/getPagingConsultationSchedules/usecase';

@Module({
  providers: [ConsultationScheduleResolver, ConsultationScheduleFilterImpl, UpsertConsultationScheduleUseCase, GetPagingConsultationScheduleUseCase],
})
export class ConsultationScheduleModule {}
