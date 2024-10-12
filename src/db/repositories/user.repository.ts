import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/baseRepository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async createUser(input: Partial<Omit<User, 'id'>>, transaction = this.manager): Promise<User> {
    const user = User.create({ ...input });
    return transaction.save(user);
  }
}
