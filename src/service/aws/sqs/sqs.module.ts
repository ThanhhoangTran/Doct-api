import { Global, Module } from '@nestjs/common';
import { SQSService } from './sqs.service';

@Global()
@Module({
  providers: [SQSService],
  exports: [SQSService],
})
export class SQSModule {}
