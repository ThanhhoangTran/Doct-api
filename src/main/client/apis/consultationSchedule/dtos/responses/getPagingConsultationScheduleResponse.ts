import { ObjectType } from '@nestjs/graphql';
import { PaginationResponse } from '../../../../../../common/response';
import { ConsultationSchedule } from '../../../../../../entities/consultationSchedule.entity';

@ObjectType()
export class GetPagingConsultationScheduleResponse extends PaginationResponse<ConsultationSchedule>(ConsultationSchedule) {}
