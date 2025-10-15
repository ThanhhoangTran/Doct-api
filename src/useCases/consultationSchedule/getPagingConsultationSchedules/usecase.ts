import { Inject, Injectable } from '@nestjs/common';
import { GetPagingConsultationScheduleInput } from './types/input';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { ConsultationScheduleRepository } from '../../../repositories/consultationSchedule.repository';
import { ROLE_NAME } from '../../../common/constants';
import { ConsultationScheduleFilterType } from '../../../main/client/apis/consultationSchedule/helpers/consultaionScheduleFilter/types/input';
import { SyncGetter } from '../../../common/interface';
import { BuilderPaginationResponse } from '../../../utils/utilFunction';
import { GetPagingConsultationScheduleResponse } from '../../../main/client/apis/consultationSchedule/dtos/responses/getPagingConsultationScheduleResponse';
import { ConsultationScheduleFilterImpl } from '../../../main/client/apis/consultationSchedule/helpers/consultaionScheduleFilter/getter';

@Injectable()
export class GetPagingConsultationScheduleUseCase extends UseCaseAbstraction<GetPagingConsultationScheduleInput, GetPagingConsultationScheduleResponse> {
  constructor(
    private readonly _consultationScheduleRepo: ConsultationScheduleRepository,
    @Inject(ConsultationScheduleFilterImpl) private readonly _consultationScheduleFilterGetter: SyncGetter<ConsultationScheduleFilterType>,
  ) {
    super();
  }

  protected async executeLogic(input: GetPagingConsultationScheduleInput, _validatedResult: void): Promise<GetPagingConsultationScheduleResponse> {
    const { pagination, user, filter } = input;
    const { role, id } = user;

    const builder = this._consultationScheduleRepo.createQueryBuilder('ConsultationSchedule').leftJoin('ConsultationSchedule.patient', 'Patient');

    if (role.name === ROLE_NAME.DOCTOR) {
      builder.innerJoin('ConsultationSchedule.timeOpening', 'TimeOpening').where('TimeOpening.userId = :doctorId');
    }

    this._consultationScheduleFilterGetter.execute({
      builder,
      ...filter,
    });

    builder.setParameters({
      doctorId: id,
    });

    return await new BuilderPaginationResponse<GetPagingConsultationScheduleResponse>(builder, pagination).execute();
  }
}
