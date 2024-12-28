import { Module } from '@nestjs/common';
import { MessageProcessorService } from './message.service';

@Module({
  providers: [MessageProcessorService],
  exports: [MessageProcessorService],
})
export class MessageProcessorModule {}
