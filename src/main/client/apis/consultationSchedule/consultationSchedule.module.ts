import { Module } from '@nestjs/common';
import { ConsultationScheduleService } from './consultationSchedule.service';
import { ConsultationScheduleResolver } from './consultationSchedule.resolver';
import { ConsultationScheduleRepository } from '../../../../repositories/consultationSchedule.repository';
import { TimeOpeningRepository } from '../../../../repositories/timeOpening.repository';

@Module({
  providers: [ConsultationScheduleResolver, ConsultationScheduleService, ConsultationScheduleRepository, TimeOpeningRepository],
})
export class ConsultationScheduleModule {}
