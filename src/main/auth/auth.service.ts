import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/inputs/signUp.dto';
import { SignInDto } from './dtos/inputs/signIn.dto';
import { UserInputError } from '@nestjs/apollo';
import { DataSource, EntityManager } from 'typeorm';
import { pick } from 'lodash';
import { SignInResponse } from './dtos/response/signInResponse';
import { GetMeResponse } from './dtos/response/getMeResponse';
import { UserRepository } from '../../repositories/user.repository';
import { RoleRepository } from '../../repositories/role.repository';
import { Role } from '../../entities/role.entity';
import { ROLE_NAME, SELECT_USER } from '../../common/constants';
import { PasswordUtil } from '../../common/passwordUtil';
import { User } from '../../entities/user.entity';
import { Jwt } from '../../service/jwt/jwt';
import { Token } from '../../entities/token.entity';

@Injectable()
export class AuthService {
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

  public async signIn(input: SignInDto): Promise<SignInResponse> {
    const { email, password } = input;

    const user = await this.userRepository.createQueryBuilder('User').leftJoinAndSelect('User.role', 'Role').where({ email }).addSelect('User.password').getOne();
    if (!user) {
      throw new UserInputError('Cannot find your email');
    }

    await PasswordUtil.validateHashPassword(password, user.password, 'Password is not correct');

    return await this.dataSource.transaction(async transaction => await this.generateUserWithAccessToken(user, transaction));
  }

  private async generateUserWithAccessToken(user: User, transaction?: EntityManager): Promise<SignInResponse> {
    const data = pick(user, SELECT_USER);

    const token = await this.createAccessToken(data, transaction);

    return {
      ...data,
      token: token.accessToken,
      refreshToken: token.refreshToken,
    } as SignInResponse;
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

  async getMe(userId: string): Promise<GetMeResponse> {
    return this.userRepository.getOneByCondition({
      throwErrorIfNotExisted: true,
      relations: ['role'],
      condition: { id: userId },
    });
  }
}
