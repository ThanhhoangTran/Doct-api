import { Role } from '@/db/entities/role.entity';
import { UserRepository } from '@/db/repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/signUp.dto';
import { RoleRepository } from '@/db/repositories/role.repository';
import { ROLE_NAME } from '@/common/constants';
import { PasswordUtil } from '@/common/passwordUtil';
import { UserInputError } from '@nestjs/apollo';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}
  async testResolver() {
    const roles = await Role.find();
    return roles;
  }

  async signUp(input: SignUpDto) {
    const { roleType, email, password, ...rest } = input;
    const role = await this.roleRepository.getOneByCondition({
      throwErrorIfNotExisted: false,
      condition: { name: roleType },
    });

    if (!role || ROLE_NAME.SUPER_ADMIN === role.name) {
      throw new UserInputError('Invalid role type!');
    }

    const existingUser = await this.userRepository.getOneByCondition({
      condition: {
        email: email,
        roles: {
          id: role.id,
        },
      },
      throwErrorIfNotExisted: false,
    });

    if (existingUser) {
      throw new Error(
        'Your email have existed in systems, please using another email!',
      );
    }

    const hashedPassword = await PasswordUtil.generateHash(password);

    //need send email to notify about info or verification code

    return await this.userRepository.createUser({
      password: hashedPassword,
      email,
      roles: [role],
      ...rest,
    });
  }
}
