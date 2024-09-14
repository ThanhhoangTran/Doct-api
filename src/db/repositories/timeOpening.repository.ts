import { BaseRepository } from '@/common/baseRepository';
import { TimeOpening } from '../entities/timeOpening.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class TimeOpeningRepository extends BaseRepository<TimeOpening> {
  constructor(private dataSource: DataSource) {
    super(TimeOpening, dataSource.createEntityManager());
  }

  public async isOverlapSchedule({
    userId,
    startOpening,
    endOpening,
    excludeTimeOpeningIds,
  }: {
    userId?: string;
    startOpening: Date;
    endOpening: Date;
    excludeTimeOpeningIds?: string[];
  }): Promise<boolean> {
    const builder = this.createQueryBuilder('TimeOpening').where(`(TimeOpening.startOpening, TimeOpening.endOpening) OVERLAPS (:startOpening, :endOpening)`, {
      startOpening,
      endOpening,
    });
    userId && builder.andWhere('TimeOpening.userId = :userId', { userId });
    excludeTimeOpeningIds.length && builder.andWhere('TimeOpening.id NOT IN (:...excludeTimeOpeningIds)', { excludeTimeOpeningIds });

    return !!(await builder.getCount());
  }

  public getOpeningByRangeTimeBuilder({ startTime, endTime, userId }: { startTime: Date; endTime: Date; userId: string }): SelectQueryBuilder<TimeOpening> {
    const builder = this.createQueryBuilder('TimeOpening')
      .leftJoinAndSelect('TimeOpening.consultationSchedule', 'ConsultationSchedule')
      .where('TimeOpening.startOpening > :startTime', { startTime })
      .andWhere('TimeOpening.endOpening < :endTime', { endTime });

    userId && builder.andWhere('TimeOpening.userId = :userId', { userId });
    return builder;
  }
}
