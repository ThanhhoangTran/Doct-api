import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { RoleRepository } from '../../db/repositories/role.repository';
import { UserRepository } from '../../db/repositories/user.repository';

@Module({
  providers: [AuthResolver, AuthService, RoleRepository, UserRepository],
})
export class AuthModule {}
