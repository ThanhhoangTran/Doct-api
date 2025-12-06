import { Injectable } from '@nestjs/common';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { GetPagingTimeOpeningInput } from './types/input';
import { TimeOpeningRepository } from '../../../repositories/timeOpening.repository';
import { BuilderPaginationResponse } from '../../../utils/utilFunction';
import { GetPagingTimeOpeningResponse } from '../../../main/client/apis/timeOpening/dtos/responses/getPagingTimeOpeningResponse';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { TimeOpening } from '../../../entities/timeOpening.entity';

@Injectable()
export class GetPagingTimeOpeningsUseCase extends UseCaseAbstraction<GetPagingTimeOpeningInput, GetPagingTimeOpeningResponse> {
  constructor(private readonly _timeOpeningRepo: TimeOpeningRepository) {
    super();
  }

  protected async executeLogic(input: GetPagingTimeOpeningInput, _validatedResult: void): Promise<GetPagingTimeOpeningResponse> {
    const { pagination, userCtx: currentUser, filter } = input;

    const builder = this._timeOpeningRepo.createQueryBuilder().where({ userId: currentUser.id });

    !!filter && this.builderFilterQuery(builder, filter);

    return new BuilderPaginationResponse<GetPagingTimeOpeningResponse>(builder, pagination).execute();
  }

  private builderFilterQuery(builder: SelectQueryBuilder<TimeOpening>, filter: GetPagingTimeOpeningInput['filter']): void {
    if (filter?.dateRange) {
      const { startDate, endDate } = filter.dateRange;
      builder.andWhere(
        new Brackets(qb => {
          qb.where('TimeOpening.startOpening >= :startDate').andWhere('TimeOpening.endOpening <= :endDate');
        }),
        { startDate, endDate },
      );
    }

    if (filter?.eventType) {
      builder.andWhere('TimeOpening.event = :eventType', { eventType: filter.eventType });
    }
  }
}
