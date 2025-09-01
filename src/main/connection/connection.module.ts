import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { JwtCommonModule } from '../../modules/jwtModule.module';
import { MessageProcessorModule } from './messageProcessor/message.module';
import { DatabaseModule } from '../../modules/database.module';

@Module({
  imports: [DatabaseModule, JwtCommonModule, MessageProcessorModule],
  providers: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {}
