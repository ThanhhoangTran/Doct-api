import { Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GetRoles } from './response/getRoles.response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => [GetRoles])
  async getExample() {
    return this.authService.testResolver();
  }
}
