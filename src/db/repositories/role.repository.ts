import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { BaseRepository } from '@/common/baseRepository';
import { DataSource } from 'typeorm';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }
}
