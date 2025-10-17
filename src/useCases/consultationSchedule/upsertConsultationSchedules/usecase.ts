import { Injectable } from '@nestjs/common';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { ConsultationScheduleRepository } from '../../../repositories/consultationSchedule.repository';
import { TimeOpeningRepository } from '../../../repositories/timeOpening.repository';
import { CONSULTATION_STATUS, EVENT_TYPE } from '../../../common/constants';
import { UserInputError } from '@nestjs/apollo';
import dayjs from 'dayjs';
import { CreateConsultationScheduleInput } from './types/input';

@Injectable()
export class CreateConsultationScheduleUseCase extends UseCaseAbstraction<CreateConsultationScheduleInput, string> {
  constructor(
    private readonly _consultationScheduleRepo: ConsultationScheduleRepository,
    private readonly _timeOpeningRepo: TimeOpeningRepository,
  ) {
    super();
  }

  protected async executeLogic(input: CreateConsultationScheduleInput, _validatedResult: void): Promise<string> {
    const { userCtx, timeOpeningId, startTime, endTime, ...rest } = input;

    const timeOpening = await this._timeOpeningRepo.getOneByCondition({
      condition: {
        id: timeOpeningId,
        userId: userCtx.id,
        event: EVENT_TYPE.APPOINTMENT,
        consultationSchedules: {
          status: CONSULTATION_STATUS.CONFIRMED,
        },
      },
      relations: ['consultationSchedules'],
      throwErrorIfNotExisted: false,
    });

    if (!timeOpening) {
      throw new UserInputError('Time opening have appointment not found');
    }

    if (dayjs(startTime).isBefore(timeOpening.startOpening) || dayjs(endTime).isAfter(timeOpening.endOpening)) {
      throw new UserInputError(`Consultation period must between ${timeOpening.startOpening.toISOString()} and ${timeOpening.endOpening.toISOString()}`);
    }

    const bookedTimeSlots = timeOpening.consultationSchedules.map(consultation => ({
      startTime: consultation.startTime,
      endTime: consultation.endTime,
    }));

    const isOverlapTimes = bookedTimeSlots.some(slot => {
      const newStart = dayjs(startTime);
      const newEnd = dayjs(endTime);
      const slotStart = dayjs(slot.startTime);
      const slotEnd = dayjs(slot.endTime);

      return newStart.isBefore(slotEnd) && newEnd.isAfter(slotStart);

      // (startTime.getTime() >= slot.startTime.getTime() && startTime.getTime() < slot.endTime.getTime()) ||
      // (endTime.getTime() >= slot.startTime.getTime() && endTime.getTime() <= slot.endTime.getTime()),
    });

    if (isOverlapTimes) {
      throw new UserInputError('This time slot has been booked, please choose another time slot');
    }

    await this._consultationScheduleRepo.save(
      this._consultationScheduleRepo.create({
        timeOpeningId,
        userId: userCtx.id,
        status: CONSULTATION_STATUS.WAITING,
        startTime,
        endTime,
        ...rest,
      }),
    );

    return 'Create consultation schedule successfully';
  }
}
