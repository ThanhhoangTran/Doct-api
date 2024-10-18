import { Module } from '@nestjs/common';
import { TimeOpeningResolver } from './timeOpening.resolver';
import { TimeOpeningService } from './timeOpening.service';
import { ScheduleTimingEventValidatorImpl } from './helpers/implementations/scheduleTimingEventValidatorImpl';
import { GetAvailableTimeOpeningHelperImpl } from './helpers/implementations/getAvailableTimeOpeningHelperImpl';
import { TimeOpeningRepository } from '../../../../repositories/timeOpening.repository';

@Module({
  providers: [TimeOpeningResolver, TimeOpeningService, TimeOpeningRepository, ScheduleTimingEventValidatorImpl, GetAvailableTimeOpeningHelperImpl],
})
export class TimeOpeningModule {}
