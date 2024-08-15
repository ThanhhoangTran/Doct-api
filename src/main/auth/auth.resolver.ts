import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signUp.dto';
import { User } from '@/db/entities/user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  async signIn() {
    return 'oke';
  }

  @Mutation(() => User)
  async signUp(@Args('input') input: SignUpDto) {
    return this.authService.signUp(input);
  }
}
