import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserRepository } from '@/db/repositories/user.repository';
import { RoleRepository } from '@/db/repositories/role.repository';

@Module({
  providers: [AuthResolver, AuthService, RoleRepository, UserRepository],
})
export class AuthModule {}
