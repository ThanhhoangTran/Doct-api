import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/inputs/signUp.dto';
import { SignInDto } from './dtos/inputs/signIn.dto';
import { SignInResponse } from './dtos/response/signInResponse';
import { GetMeResponse } from './dtos/response/getMeResponse';
import { UserResponse } from '../../common/dtos/responses/userResponse.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserContext } from '../../common/decorators/user.decorator';
import { UserContextInterface } from '../../common/interface';
import { User } from '../../entities/user.entity';
import { TestQueuePublisher } from '../sqsWorkers/processors/testProcessor/publisher';
@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly _testQueuePublisher: TestQueuePublisher,
  ) {}

  @Query(_type => SignInResponse)
  async signIn(@Args('input') input: SignInDto): Promise<SignInResponse> {
    return await this.authService.signIn(input);
  }

  @Mutation(_type => UserResponse)
  async signUp(@Args('input') input: SignUpDto): Promise<UserResponse> {
    return this.authService.signUp(input);
  }

  @Auth(['Roles'])
  @Query(_type => GetMeResponse)
  async getMe(@UserContext() { id }: UserContextInterface): Promise<GetMeResponse> {
    return this.authService.getMe(id);
  }

  @Query(_type => Boolean)
  async publishMessageToQueue(): Promise<boolean> {
    await this._testQueuePublisher.sendMessage({ text: 'Hello from TestQueuePublisher' });

    return true;
  }
}
