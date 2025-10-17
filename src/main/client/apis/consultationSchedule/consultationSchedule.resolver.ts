import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserContext } from '../../../../common/decorators/user.decorator';
import { IUseCase, UserContextInterface } from '../../../../common/interface';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Auth } from '../../../../common/decorators/auth.decorator';
import { ROLE_NAME } from '../../../../common/constants';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { GetPagingConsultationScheduleFilter } from './dtos/inputs/getPagingConsultationScheduleFilter.dto';
import { Inject } from '@nestjs/common';
import { GetPagingConsultationScheduleUseCase } from '../../../../useCases/consultationSchedule/getPagingConsultationSchedules/usecase';
import { GetPagingConsultationScheduleInput } from '../../../../useCases/consultationSchedule/getPagingConsultationSchedules/types/input';
import { GetPagingConsultationScheduleResponse } from './dtos/responses/getPagingConsultationScheduleResponse';
import { CreateConsultationScheduleInputType } from './dtos/inputs/upsertConsultationScheduleInputType.dto';
import { CreateConsultationScheduleUseCase } from '../../../../useCases/consultationSchedule/upsertConsultationSchedules/usecase';
import { CreateConsultationScheduleInput } from '../../../../useCases/consultationSchedule/upsertConsultationSchedules/types/input';
import { ChangeConsultationStatusInputType } from './dtos/inputs/changeConsultationStatusInputType.dto';
import { ChangeConsultationStatusUseCase } from '../../../../useCases/consultationSchedule/changeConsultationStatus/usecase';
import { ChangeConsultationStatusInput } from '../../../../useCases/consultationSchedule/changeConsultationStatus/types/input';

@Auth(['Roles'])
@Resolver()
export class ConsultationScheduleResolver {
  public constructor(
    @Inject(GetPagingConsultationScheduleUseCase)
    private readonly _getPagingConsultationSchedules: IUseCase<GetPagingConsultationScheduleInput, GetPagingConsultationScheduleResponse>,
    @Inject(CreateConsultationScheduleUseCase)
    private readonly _createConsultationSchedule: IUseCase<CreateConsultationScheduleInput, string>,
    @Inject(ChangeConsultationStatusUseCase) private readonly _changeConsultationStatus: IUseCase<ChangeConsultationStatusInput, string>,
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

  //Patient must create consultation -> Doctor will accept or reject
  @Roles(ROLE_NAME.PATIENT)
  @Mutation(_type => String)
  public async createConsultationSchedule(@Args('input') input: CreateConsultationScheduleInputType, @UserContext() currentUser: UserContextInterface): Promise<string> {
    return await this._createConsultationSchedule.execute({
      ...input,
      userCtx: currentUser,
    });
  }

  @Mutation(_type => String)
  public async changeConsultationStatus(@Args('input') input: ChangeConsultationStatusInputType, @UserContext() userCtx: UserContextInterface): Promise<string> {
    return await this._changeConsultationStatus.execute({
      ...input,
      userCtx,
    });
  }
}
