import { Inject, Injectable } from '@nestjs/common';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { UpsertScheduleTimingEventInput } from './types/input';
import { TimeOpeningRepository } from '../../../repositories/timeOpening.repository';
import { UserInputError } from '@nestjs/apollo';
import { ErrorMessage } from '../../../errorMessages';
import { Getter } from '../../../common/interface';
import { OverlapScheduleTimingEventValidatorInput } from '../../../main/client/apis/timeOpening/helpers/overlapScheduleTimingEventValidator/types/input';
import { notUndefined } from '../../../utils/utilFunction';
import { TimeOpening } from '../../../entities/timeOpening.entity';
import { OverlapScheduleTimingEventValidatorImpl } from '../../../main/client/apis/timeOpening/helpers/overlapScheduleTimingEventValidator/validator';

@Injectable()
export class UpsertScheduleTimingEventUseCase extends UseCaseAbstraction<UpsertScheduleTimingEventInput, TimeOpening> {
  constructor(
    private readonly _timeOpeningRepo: TimeOpeningRepository,
    @Inject(OverlapScheduleTimingEventValidatorImpl) private readonly _overlapScheduleTimingEventValidator: Getter<OverlapScheduleTimingEventValidatorInput>,
  ) {
    super();
  }

  protected async executeLogic(input: UpsertScheduleTimingEventInput, _validatedResult: void): Promise<TimeOpening> {
    const { userCtx, id, ...rest } = input;
    const existingTimeOpening = id ? await this._timeOpeningRepo.findOne({ where: { id } }) : undefined;
    if (id && !existingTimeOpening) {
      throw new UserInputError(ErrorMessage.TIME_OPENING.TIME_OPENING_NOT_FOUND);
    }

    await this._overlapScheduleTimingEventValidator.execute({
      startTime: rest.startOpening,
      endTime: rest.endOpening,
      userId: userCtx.id,
      excludeTimeOpeningIds: [id].filter(notUndefined),
    });

    const timeOpening = this._timeOpeningRepo.merge(existingTimeOpening ?? this._timeOpeningRepo.create({ userId: userCtx.id }), { ...rest, event: rest.eventType });
    return await this._timeOpeningRepo.save(timeOpening);
  }
}
