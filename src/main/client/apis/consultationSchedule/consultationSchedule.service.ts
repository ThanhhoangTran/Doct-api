import { Injectable } from '@nestjs/common';
import { GetPagingConsultationScheduleResponse } from './dtos/responses/getPagingConsultationScheduleResponses';
import { UserContextInterface } from '../../../../common/interface';
import { ConsultationScheduleRepository } from '../../../../repositories/consultationSchedule.repository';
import { BuilderPaginationResponse } from '../../../../utils/utilFunction';
import { CONSULTATION_STATUS, EVENT_TYPE, ROLE_NAME } from '../../../../common/constants';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { UpsertConsultationScheduleInput } from './dtos/inputs/upsertConsultationScheduleInput.dto';
import { CustomDataSourceManager } from '../../../../utils/customEntityManager';
import { TimeOpeningRepository } from '../../../../repositories/timeOpening.repository';
import dayjs from 'dayjs';
import { UserInputError } from '@nestjs/apollo';
import { ConsultationSchedule } from '../../../../entities/consultationSchedule.entity';

@Injectable()
export class ConsultationScheduleService {
  public constructor(
    private readonly _consultationScheduleRepo: ConsultationScheduleRepository,
    private readonly _timeOpeningRepo: TimeOpeningRepository,
  ) {}

  public async getPagingConsultationSchedules(pagination: PaginationDto, user: UserContextInterface): Promise<GetPagingConsultationScheduleResponse> {
    const { role, id } = user;
    const builder = this._consultationScheduleRepo.createQueryBuilder('ConsultationSchedule').leftJoin('ConsultationSchedule.patient', 'Patient');

    if (role.name === ROLE_NAME.DOCTOR) {
      builder.innerJoin('ConsultationSchedule.timeOpening', 'TimeOpening').where('TimeOpening.userId = :doctorId');
    }

    builder.setParameters({
      doctorId: id,
    });

    return await new BuilderPaginationResponse<GetPagingConsultationScheduleResponse>(builder, pagination).execute();
  }

  public async upsertConsultationSchedule(input: UpsertConsultationScheduleInput, currentUser: UserContextInterface): Promise<string> {
    const { id, timeOpeningId, startTime, endTime, ...rest } = input;
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
        userId: currentUser.id,
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

    //validate a timeOpening have mutiple consultation, validate all time in timeOpening

    return await new CustomDataSourceManager().initialTransaction(async trx => {
      if (consultationSchedule) {
        await this._consultationScheduleRepo.updatePartial(
          { id: consultationSchedule.id },
          {
            timeOpeningId,
            startTime,
            endTime,
            ...rest,
          },
          trx,
        );
      } else {
        await trx.getRepository(ConsultationSchedule).insert(
          ConsultationSchedule.create({
            ...input,
            status: CONSULTATION_STATUS.WAITING,
          }),
        );
      }

      return `Upsert consultation successfully`;
    });
  }
}
