import { Injectable } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../../common/baseRepository';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }
}
