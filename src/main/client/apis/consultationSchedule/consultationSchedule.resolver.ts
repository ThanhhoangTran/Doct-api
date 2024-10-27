import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetPagingConsultationScheduleResponse } from './dtos/responses/getPagingConsultationScheduleResponses';
import { UserContext } from '../../../../common/decorators/user.decorator';
import { UserContextInterface } from '../../../../common/interface';
import { ConsultationScheduleService } from './consultationSchedule.service';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Auth } from '../../../../common/decorators/auth.decorator';
import { ROLE_NAME } from '../../../../common/constants';
import { PaginationDto } from '../../../../common/dtos/queryFilter.dto';
import { ConsultationSchedule } from '../../../../entities/consultationSchedule.entity';
import { UpsertConsultationScheduleInput } from './dtos/inputs/upsertConsultationScheduleInput.dto';

@Auth(['Roles'])
@Resolver()
export class ConsultationScheduleResolver {
  public constructor(private readonly _consultationScheduleService: ConsultationScheduleService) {}

  @Roles(ROLE_NAME.DOCTOR, ROLE_NAME.PATIENT)
  @Query(_type => GetPagingConsultationScheduleResponse)
  public async getPagingConsultationSchedules(
    @Args('pagination') pagination: PaginationDto,
    @UserContext() user: UserContextInterface,
  ): Promise<GetPagingConsultationScheduleResponse> {
    return await this._consultationScheduleService.getPagingConsultationSchedules(pagination, user);
  }

  @Roles(ROLE_NAME.DOCTOR)
  @Mutation(_type => String)
  public async upsertConsultationSchedule(@Args('input') input: UpsertConsultationScheduleInput, @UserContext() currentUser: UserContextInterface) {
    return await this._consultationScheduleService.upsertConsultationSchedule(input, currentUser);
  }
}
