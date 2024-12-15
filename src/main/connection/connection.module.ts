import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { JwtCommonModule } from '../../modules/jwtModule.module';
import { mongooseModules } from '../../modules/database.module';

@Module({
  imports: [...mongooseModules(), JwtCommonModule],
  providers: [ConnectionService],
})
export class ConnectionModule {}
