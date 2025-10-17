import { Module } from '@nestjs/common';
import { ConsultationScheduleResolver } from './consultationSchedule.resolver';
import { ConsultationScheduleFilterImpl } from './helpers/consultaionScheduleFilter/getter';
import { GetPagingConsultationScheduleUseCase } from '../../../../useCases/consultationSchedule/getPagingConsultationSchedules/usecase';
import { CreateConsultationScheduleUseCase } from '../../../../useCases/consultationSchedule/upsertConsultationSchedules/usecase';
import { ChangeConsultationStatusUseCase } from '../../../../useCases/consultationSchedule/changeConsultationStatus/usecase';

@Module({
  providers: [
    ConsultationScheduleResolver,
    ConsultationScheduleFilterImpl,
    CreateConsultationScheduleUseCase,
    GetPagingConsultationScheduleUseCase,
    ChangeConsultationStatusUseCase,
  ],
})
export class ConsultationScheduleModule {}
