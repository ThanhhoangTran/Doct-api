import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { JwtCommonModule } from '../../modules/jwtModule.module';
import { DbConnectionModule } from './dbConnection.module';
import { MessageProcessorModule } from './messageProcessor/message.module';

@Module({
  imports: [DbConnectionModule, JwtCommonModule, MessageProcessorModule],
  providers: [ConnectionService],
})
export class ConnectionModule {}
