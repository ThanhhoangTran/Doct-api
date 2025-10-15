import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserContext } from '../../../../common/decorators/user.decorator';
import { IUseCase, UserContextInterface } from '../../../../common/interface';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Auth } from '../../../../common/decorators/auth.decorator';
import { ROLE_NAME } from '../../../../common/constants';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { UpsertConsultationScheduleInputType } from './dtos/inputs/upsertConsultationScheduleInputType.dto';
import { GetPagingConsultationScheduleFilter } from './dtos/inputs/getPagingConsultationScheduleFilter.dto';
import { Inject } from '@nestjs/common';
import { GetPagingConsultationScheduleUseCase } from '../../../../useCases/consultationSchedule/getPagingConsultationSchedules/usecase';
import { GetPagingConsultationScheduleInput } from '../../../../useCases/consultationSchedule/getPagingConsultationSchedules/types/input';
import { GetPagingConsultationScheduleResponse } from './dtos/responses/getPagingConsultationScheduleResponse';
import { UpsertConsultationScheduleUseCase } from '../../../../useCases/consultationSchedule/upsertConsultationSchedules/usecase';
import { UpsertConsultationScheduleInput } from '../../../../useCases/consultationSchedule/upsertConsultationSchedules/types/input';

@Auth(['Roles'])
@Resolver()
export class ConsultationScheduleResolver {
  public constructor(
    @Inject(GetPagingConsultationScheduleUseCase)
    private readonly _getPagingConsultationSchedules: IUseCase<GetPagingConsultationScheduleInput, GetPagingConsultationScheduleResponse>,
    @Inject(UpsertConsultationScheduleUseCase)
    private readonly _upsertConsultationSchedule: IUseCase<UpsertConsultationScheduleInput, string>,
  ) {}

  @Roles(ROLE_NAME.DOCTOR, ROLE_NAME.PATIENT)
  @Query(_type => GetPagingConsultationScheduleResponse)
  public async getPagingConsultationSchedules(
    @Args('pagination') pagination: PaginationDto,
    @Args('filter', { nullable: true }) filter: GetPagingConsultationScheduleFilter | null,
    @UserContext() user: UserContextInterface,
  ): Promise<GetPagingConsultationScheduleResponse> {
    return await this._getPagingConsultationSchedules.execute({ pagination, user, filter: filter ?? {} });
  }

  @Roles(ROLE_NAME.DOCTOR)
  @Mutation(_type => String)
  public async upsertConsultationSchedule(@Args('input') input: UpsertConsultationScheduleInputType, @UserContext() currentUser: UserContextInterface): Promise<string> {
    return await this._upsertConsultationSchedule.execute({
      ...input,
      userCtx: currentUser,
    });
  }
}
