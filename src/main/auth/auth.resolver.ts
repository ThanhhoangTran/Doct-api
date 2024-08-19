import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signUp.dto';
import { User } from '@/db/entities/user.entity';
import { SignInDto } from './dtos/signIn.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  async signIn(@Args('input') input: SignInDto) {
    return this.authService.signIn(input);
  }

  @Mutation(() => User)
  async signUp(@Args('input') input: SignUpDto) {
    return this.authService.signUp(input);
  }
}
