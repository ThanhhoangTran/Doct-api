import { Injectable } from '@nestjs/common';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { GetPagingTimeOpeningInput } from './types/input';
import { TimeOpeningRepository } from '../../../repositories/timeOpening.repository';
import { BuilderPaginationResponse } from '../../../utils/utilFunction';
import { GetPagingTimeOpeningResponse } from '../../../main/client/apis/timeOpening/dtos/responses/getPagingTimeOpeningResponse';

@Injectable()
export class GetPagingTimeOpeningsUseCase extends UseCaseAbstraction<GetPagingTimeOpeningInput, GetPagingTimeOpeningResponse> {
  constructor(private readonly _timeOpeningRepo: TimeOpeningRepository) {
    super();
  }

  protected async executeLogic(input: GetPagingTimeOpeningInput, _validatedResult: void): Promise<GetPagingTimeOpeningResponse> {
    const { pagination, userCtx: currentUser } = input;

    const builder = this._timeOpeningRepo.createQueryBuilder().where({ userId: currentUser.id });
    return new BuilderPaginationResponse<GetPagingTimeOpeningResponse>(builder, pagination).execute();
  }
}
