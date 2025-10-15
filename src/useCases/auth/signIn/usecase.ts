import { Inject, Injectable } from '@nestjs/common';
import { UseCaseAbstraction } from '../../../common/abstractions/usecase.abstraction';
import { SignInInput } from './types/input';
import { SignInOutput } from './types/output';
import { SELECT_USER } from '../../../common/constants';
import { DataSource, EntityManager } from 'typeorm';
import { User } from '../../../entities/user.entity';
import { pick } from 'lodash';
import { Token } from '../../../entities/token.entity';
import { Jwt } from '../../../service/jwt/jwt';
import { SignInInputValidator } from './validators/inputValidator';
import { IInputValidator } from '../../../common/interface';

@Injectable()
export class SignInUseCase extends UseCaseAbstraction<SignInInput, SignInOutput, User> {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(SignInInputValidator) protected readonly _inputValidator: IInputValidator<SignInInput, User>,
  ) {
    super();
  }

  protected async executeLogic(_input: SignInInput, _validatedResult: User): Promise<SignInOutput> {
    return await this.dataSource.transaction(async transaction => await this.generateUserWithAccessToken(_validatedResult, transaction));
  }

  private async generateUserWithAccessToken(user: User, transaction?: EntityManager): Promise<SignInOutput> {
    const data = pick(user, SELECT_USER);

    const token = await this.createAccessToken(data, transaction);

    return {
      ...data,
      token: token.accessToken,
      refreshToken: token.refreshToken,
    } as SignInOutput;
  }

  private async createAccessToken(user: Partial<User>, transaction?: EntityManager): Promise<Token> {
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
