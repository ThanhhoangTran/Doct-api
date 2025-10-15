import { Injectable } from '@nestjs/common';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { UpsertConsultationScheduleInput } from './types/input';
import { ConsultationScheduleRepository } from '../../../repositories/consultationSchedule.repository';
import { TimeOpeningRepository } from '../../../repositories/timeOpening.repository';
import { CustomDataSourceManager } from '../../../utils/customEntityManager';
import { CONSULTATION_STATUS, EVENT_TYPE } from '../../../common/constants';
import { UserInputError } from '@nestjs/apollo';
import dayjs from 'dayjs';
import { ConsultationSchedule } from '../../../entities/consultationSchedule.entity';

@Injectable()
export class UpsertConsultationScheduleUseCase extends UseCaseAbstraction<UpsertConsultationScheduleInput, string> {
  constructor(
    private readonly _consultationScheduleRepo: ConsultationScheduleRepository,
    private readonly _timeOpeningRepo: TimeOpeningRepository,
  ) {
    super();
  }

  protected async executeLogic(input: UpsertConsultationScheduleInput, _validatedResult: void): Promise<string> {
    const { userCtx, id, timeOpeningId, startTime, endTime, patientInfo, ...rest } = input;

    const consultationSchedule = await this._consultationScheduleRepo.getOneByCondition({
      condition: {
        id,
      },
      throwErrorIfNotExisted: false,
    });

    const timeOpening = await this._timeOpeningRepo.getOneByCondition({
      condition: {
        id: timeOpeningId,
        event: EVENT_TYPE.APPOINTMENT,
        userId: userCtx.id,
      },
      relations: ['consultationSchedules'],
      throwErrorIfNotExisted: false,
    });

    if (!timeOpening) {
      throw new UserInputError('Only time opening have appointment type can make consultation');
    }

    if (dayjs(startTime).isBefore(timeOpening.startOpening) || dayjs(endTime).isAfter(timeOpening.endOpening)) {
      throw new UserInputError(`Consultation period must between ${timeOpening.startOpening.toISOString()} and ${timeOpening.endOpening.toISOString()}`);
    }

    return await new CustomDataSourceManager().initialTransaction(async trx => {
      if (consultationSchedule) {
        await this._consultationScheduleRepo.updatePartial(
          { id: consultationSchedule.id },
          {
            timeOpeningId,
            startTime,
            endTime,
            patientInfo: patientInfo,
            ...rest,
          },
          trx,
        );
      } else {
        await trx.getRepository(ConsultationSchedule).insert(
          ConsultationSchedule.create({
            ...input,
            status: CONSULTATION_STATUS.WAITING,
            patientInfo: patientInfo,
          }),
        );
      }

      return `Upsert consultation successfully`;
    });
  }
}
