import { Module } from '@nestjs/common';
import { ConsultationScheduleService } from './consultationSchedule.service';
import { ConsultationScheduleResolver } from './consultationSchedule.resolver';
import { ConsultationScheduleRepository } from '../../../../repositories/consultationSchedule.repository';
import { TimeOpeningRepository } from '../../../../repositories/timeOpening.repository';
import { ConsultationScheduleFilterImpl } from './helpers/implementations/consultationScheduleFilterImpl';

@Module({
  providers: [ConsultationScheduleResolver, ConsultationScheduleService, ConsultationScheduleRepository, TimeOpeningRepository, ConsultationScheduleFilterImpl],
})
export class ConsultationScheduleModule {}
