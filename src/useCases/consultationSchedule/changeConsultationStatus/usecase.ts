import { Injectable } from '@nestjs/common';
import { ChangeConsultationStatusInput } from './types/input';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { ConsultationScheduleRepository } from '../../../repositories/consultationSchedule.repository';
import { CONSULTATION_STATUS, CONSULTATION_STATUS_FLOW, ROLE_NAME } from '../../../common/constants';
import dayjs from 'dayjs';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class ChangeConsultationStatusUseCase extends UseCaseAbstraction<ChangeConsultationStatusInput, string> {
  public constructor(private readonly _consultationScheduleRepo: ConsultationScheduleRepository) {
    super();
  }

  // base on role to check permission
  // if waiting -> doctor should change status before min 5p of startTime
  // if not -> should move status to cancelled

  protected async executeLogic(input: ChangeConsultationStatusInput, _validatedResult: void): Promise<string> {
    const { consultationScheduleId, status: changeTo, userCtx, startTime, endTime } = input;
    const consultation = await this._consultationScheduleRepo.getOneByCondition({
      condition: {
        id: consultationScheduleId,
      },
      throwErrorIfNotExisted: true,
    });

    const now = dayjs();

    const allowedStatusTransitions = CONSULTATION_STATUS_FLOW[consultation.status];

    if (allowedStatusTransitions.length && !allowedStatusTransitions.includes(changeTo)) {
      throw new UserInputError(`Cannot change status from ${consultation.status} to ${changeTo}`);
    }

    if ([CONSULTATION_STATUS.IN_PROGRESS, CONSULTATION_STATUS.MISSED].includes(changeTo)) {
      throw new UserInputError(`Cannot change status to ${changeTo} directly, it must be automatically changed by the system`);
    }

    if (userCtx.role.name !== ROLE_NAME.SUPER_ADMIN) {
      if (consultation.status === CONSULTATION_STATUS.CONFIRMED) {
        throw new UserInputError('Only super admin can change status from confirmed to another status');
      }

      if (dayjs(consultation.startTime).subtract(5, 'minutes').isAfter(now)) {
        throw new UserInputError('You can only change status before 5 minutes of the consultation start time');
      }

      if (userCtx.role.name === ROLE_NAME.PATIENT && [CONSULTATION_STATUS.CONFIRMED, CONSULTATION_STATUS.IN_PROGRESS].includes(changeTo)) {
        throw new UserInputError('Patients does not have permission to change status');
      }
    }

    if (changeTo === CONSULTATION_STATUS.RESCHEDULED) {
      // should notification to user to re-schedule
    }

    await this._consultationScheduleRepo.save({
      ...consultation,
      status: changeTo,
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
    });

    return 'Consultation status changed successfully';
  }
}
