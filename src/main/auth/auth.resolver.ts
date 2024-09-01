import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signUp.dto';
import { User } from '@/db/entities/user.entity';
import { SignInDto } from './dtos/signIn.dto';
import { SignInResponse } from './response/signIn.response';
import { Roles } from '@/common/decorators/roles.decorator';
import { Auth } from '@/common/decorators/auth.decorator';
import { ROLE_NAME } from '@/common/constants';
import { UserContext } from '@/common/decorators/user.decorator';
import { BaseQueryFilterDto } from '@/common/dtos/queryFilter.dto';
import { UserPaginationResponse } from './response/user.response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => SignInResponse)
  async signIn(@Args('input') input: SignInDto): Promise<SignInResponse> {
    return await this.authService.signIn(input);
  }

  @Roles(ROLE_NAME.PATIENT)
  @Auth(['roles'])
  @Query(() => UserPaginationResponse)
  async Test(@UserContext() user: User, @Args('queryParams') query: BaseQueryFilterDto) {
    return this.authService.test(query);
  }

  @Mutation(() => User)
  async signUp(@Args('input') input: SignUpDto) {
    return this.authService.signUp(input);
  }
}
