import { Injectable } from '@nestjs/common';
import { IInputValidator } from '../../../../common/interface';
import { SignInInput } from '../types/input';
import { UserRepository } from '../../../../repositories/user.repository';
import { UserInputError } from '@nestjs/apollo';
import { PasswordUtil } from '../../../../common/passwordUtil';
import { User } from '../../../../entities/user.entity';

@Injectable()
export class SignInInputValidator implements IInputValidator<SignInInput, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(input: SignInInput): Promise<User> {
    const { email, password } = input;

    const user = await this.userRepository.createQueryBuilder('User').leftJoinAndSelect('User.role', 'Role').where({ email }).addSelect('User.password').getOne();

    if (!user) {
      throw new UserInputError('Cannot find your email');
    }

    await PasswordUtil.validateHashPassword(password, user.password, 'Password is not correct');

    return user;
  }
}
