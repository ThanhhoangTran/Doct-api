import { DataSource } from 'typeorm';
import { BaseRepository } from '../common/baseRepository';
import { ConsultationSchedule } from '../entities/consultationSchedule.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConsultationScheduleRepository extends BaseRepository<ConsultationSchedule> {
  public constructor(private dataSource: DataSource) {
    super(ConsultationSchedule, dataSource.createEntityManager());
  }
}
