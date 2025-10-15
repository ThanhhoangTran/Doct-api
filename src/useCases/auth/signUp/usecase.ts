import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { SignUpInput } from './types/input';
import { SignUpOutput } from './types/output';
import { RoleRepository } from '../../../repositories/role.repository';
import { ROLE_NAME } from '../../../common/constants';
import { UserRepository } from '../../../repositories/user.repository';
import { PasswordUtil } from '../../../common/passwordUtil';

@Injectable()
export class SignUpUseCase extends UseCaseAbstraction<SignUpInput, SignUpOutput> {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }
  protected async executeLogic(input: SignUpInput): Promise<SignUpOutput> {
    const { email, password, roleType, ...rest } = input;

    const role = await this.roleRepository.getOneByCondition({
      condition: {
        name: roleType,
      },
      throwErrorIfNotExisted: false,
    });

    if (!role || role.name === ROLE_NAME.SUPER_ADMIN) {
      throw new BadRequestException('Invalid role type');
    }

    const existingUser = await this.userRepository.getOneByCondition({
      condition: {
        email: email,
      },
      throwErrorIfNotExisted: false,
    });

    if (existingUser) {
      throw new Error('Your email have existed in systems, please using another email!');
    }

    const hashedPassword = await PasswordUtil.generateHash(password);

    return await this.userRepository.createUser({
      password: hashedPassword,
      email,
      roleId: role.id,
      ...rest,
    });
  }
}
