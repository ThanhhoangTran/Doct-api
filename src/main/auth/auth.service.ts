import { Role } from '@/db/entities/role.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async testResolver() {
    const roles = await Role.find();
    return roles;
  }
}
