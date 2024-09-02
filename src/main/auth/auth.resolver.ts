import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signUp.dto';
import { User } from '@/db/entities/user.entity';
import { SignInDto } from './dtos/signIn.dto';
import { SignInResponse } from './response/signIn.response';
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => SignInResponse)
  async signIn(@Args('input') input: SignInDto): Promise<SignInResponse> {
    return await this.authService.signIn(input);
  }

  @Mutation(() => User)
  async signUp(@Args('input') input: SignUpDto) {
    return this.authService.signUp(input);
  }
}
