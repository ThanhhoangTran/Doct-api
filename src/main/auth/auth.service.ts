import { Role } from '@/db/entities/role.entity';
import { UserRepository } from '@/db/repositories/user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/signUp.dto';
import { PasswordUtil } from '@/common/passwordUtil';
import { SignInDto } from './dtos/signIn.dto';
import { UserInputError } from '@nestjs/apollo';
import { DataSource, EntityManager } from 'typeorm';
import { User } from '@/db/entities/user.entity';
import { pick } from 'lodash';
import { Jwt } from '@/service/jwt/jwt';
import { Token } from '@/db/entities/token.entity';
import { RoleRepository } from '@/db/repositories/role.repository';
import { ROLE_NAME } from '@/common/constants';

@Injectable()
export class AuthService {
  private SELECT_USER = ['firstName', 'lastName', 'email', 'id', 'role'];

  public constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}
  async testResolver() {
    const roles = await Role.find();
    return roles;
  }

  public async signUp(input: SignUpDto) {
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

  public async signIn(input: SignInDto) {
    const { email, password } = input;
    const user = await this.userRepository.createQueryBuilder('User').where({ email }).addSelect('User.password').getOne();
    if (!user) {
      throw new UserInputError('Cannot find your email');
    }

    await PasswordUtil.validateHashPassword(password, user.password, 'Password is not correct');

    return await this.dataSource.transaction(async transaction => await this.generateUserWithAccessToken(user, transaction));
  }

  private async generateUserWithAccessToken(user: User, transaction?: EntityManager) {
    const data = pick(user, this.SELECT_USER);

    const token = await this.createAccessToken(data, transaction);

    return {
      ...data,
      token: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  private async createAccessToken(user: Partial<User>, transaction?: EntityManager) {
    const trx = transaction;
    const tokenizedData = {
      ...user,
    };
    const accessToken = await Jwt.issue(tokenizedData);
    const refreshToken = await Jwt.issueRefreshToken(tokenizedData);

    const newToken = trx.getRepository(Token).create();
    newToken.userId = user.id;
    newToken.email = user.email;
    newToken.refreshToken = refreshToken;
    newToken.accessToken = accessToken;
    newToken.lastUsed = new Date();

    await trx.getRepository(Token).save(newToken);

    return newToken;
  }
}
