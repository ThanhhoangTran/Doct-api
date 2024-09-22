import { Module } from '@nestjs/common';
import { TimeOpeningResolver } from './timeOpening.resolver';
import { TimeOpeningService } from './timeOpening.service';
import { TimeOpeningRepository } from '@/db/repositories/timeOpening.repository';
import { ScheduleTimingEventValidatorImpl } from './helpers/implementations/scheduleTimingEventValidatorImpl';
import { GetAvailableTimeOpeningHelperImpl } from './helpers/implementations/getAvailableTimeOpeningHelperImpl';

@Module({
  providers: [TimeOpeningResolver, TimeOpeningService, TimeOpeningRepository, ScheduleTimingEventValidatorImpl, GetAvailableTimeOpeningHelperImpl],
})
export class TimeOpeningModule {}
