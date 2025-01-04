import { Body, Controller, Module, Post, UseFilters } from '@nestjs/common';
import { FakeConnectionService } from './fakeConnection.service';
import { ConnectionModule } from '../connection/connection.module';
import { ConnectionFakePayload } from './dtos/connectionFakePayload';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserContext } from '../../common/decorators/user.decorator';
import { UserContextInterface } from '../../common/interface';
import { JwtStrategy } from '../../service/jwt/strategies/jwt.strategy';
import { HttpExceptionFilter } from '../../common/exceptions/httpExceptionFilter';

@Auth()
@Controller()
@UseFilters(new HttpExceptionFilter())
class FakeConnectionController {
  constructor(private readonly _fakeConnectionService: FakeConnectionService) {}

  @Post('process')
  async processConnection(@Body() body: ConnectionFakePayload, @UserContext() user: UserContextInterface) {
    return await this._fakeConnectionService.handle(body, user);
  }
}

@Module({
  imports: [ConnectionModule],
  controllers: [FakeConnectionController],
  providers: [FakeConnectionService, JwtStrategy],
})
export class FakeConnectionModule {}
