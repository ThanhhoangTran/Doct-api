import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { RoleRepository } from '../../repositories/role.repository';
import { UserRepository } from '../../repositories/user.repository';
import { TestQueuePublisher } from '../sqsWorkers/processors/testProcessor/publisher';

@Module({
  providers: [AuthResolver, AuthService, RoleRepository, UserRepository, TestQueuePublisher],
})
export class AuthModule {}
