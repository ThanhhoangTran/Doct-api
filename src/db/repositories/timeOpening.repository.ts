import { BaseRepository } from '@/common/baseRepository';
import { TimeOpening } from '../entities/timeOpening.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

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
  }) {
    const builder = this.createQueryBuilder().where(`(TimeOpening.startOpening, TimeOpening.endOpening) OVERLAPS (:startOpening, :endOpening)`, {
      startOpening,
      endOpening,
    });
    userId && builder.andWhere('TimeOpening.userId = :userId', { userId });
    excludeTimeOpeningIds.length && builder.andWhere('TimeOpening.id NOT IN (...:excludeTimeOpeningIds)', { excludeTimeOpeningIds });
    return !!builder.getCount();
  }
}
