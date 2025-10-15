import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SignUpDto } from './dtos/inputs/signUp.dto';
import { SignInDto } from './dtos/inputs/signIn.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserContext } from '../../common/decorators/user.decorator';
import { IUseCase, UserContextInterface } from '../../common/interface';
import { User } from '../../entities/user.entity';
import { TestQueuePublisher } from '../sqsWorkers/processors/testProcessor/publisher';
import { Inject } from '@nestjs/common';
import { SignInUseCase } from '../../useCases/auth/signIn/usecase';
import { SignInInput } from '../../useCases/auth/signIn/types/input';
import { SignInOutput } from '../../useCases/auth/signIn/types/output';
import { SignUpOutput } from '../../useCases/auth/signUp/types/output';
import { SignUpUseCase } from '../../useCases/auth/signUp/usecase';
import { GetMeUseCase } from '../../useCases/auth/getMe/usecase';
import { GetMeInput } from '../../useCases/auth/getMe/types/input';
import { GetMeOutput } from '../../useCases/auth/getMe/types/output';
import { GetMeResponse } from './dtos/responses/getMeResponse.dto';
import { SignInResponse } from './dtos/responses/signInResponse.dto';
import { SignUpResponse } from './dtos/responses/signUpResponse.dto';
@Resolver(() => User)
export class AuthResolver {
  constructor(
    @Inject(SignInUseCase) private readonly _signIn: IUseCase<SignInInput, SignInOutput>,
    @Inject(SignUpUseCase) private readonly _signUp: IUseCase<SignUpDto, SignUpOutput>,
    @Inject(GetMeUseCase) private readonly _getMe: IUseCase<GetMeInput, GetMeOutput>,
    private readonly _testQueuePublisher: TestQueuePublisher,
  ) {}

  @Query(_type => SignInResponse)
  async signIn(@Args('input') input: SignInDto): Promise<SignInOutput> {
    return await this._signIn.execute(input);
  }

  @Mutation(_type => SignUpResponse)
  async signUp(@Args('input') input: SignUpDto): Promise<SignUpOutput> {
    return await this._signUp.execute(input);
  }

  @Auth(['Roles'])
  @Query(_type => GetMeResponse)
  async getMe(@UserContext() { id }: UserContextInterface): Promise<GetMeOutput> {
    return await this._getMe.execute({ userId: id });
  }

  @Query(_type => Boolean)
  async publishMessageToQueue(): Promise<boolean> {
    await this._testQueuePublisher.sendMessage({ text: 'Hello from TestQueuePublisher' });
    return true;
  }
}
