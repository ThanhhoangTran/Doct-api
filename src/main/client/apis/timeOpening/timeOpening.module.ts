import { Module } from '@nestjs/common';
import { TimeOpeningResolver } from './timeOpening.resolver';
import { OverlapScheduleTimingEventValidatorImpl } from './helpers/overlapScheduleTimingEventValidator/validator';
import { GetAvailableTimeOpeningHelperImpl } from './helpers/getAvailableTimeOpening/getter';
import { GetPagingTimeOpeningsUseCase } from '../../../../useCases/timeOpening/getPagingTimeOpenings/usecase';
import { GetAvailableTimeOpeningRangesUseCase } from '../../../../useCases/timeOpening/getAvailableTimeOpeningRanges/usecase';
import { UpsertScheduleTimingEventUseCase } from '../../../../useCases/timeOpening/upsertScheduleTimingEvent/usecase';

@Module({
  providers: [
    TimeOpeningResolver,
    UpsertScheduleTimingEventUseCase,
    GetPagingTimeOpeningsUseCase,
    GetAvailableTimeOpeningRangesUseCase,
    OverlapScheduleTimingEventValidatorImpl,
    GetAvailableTimeOpeningHelperImpl,
  ],
})
export class TimeOpeningModule {}
