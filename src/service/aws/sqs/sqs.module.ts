import { Global, Module } from '@nestjs/common';
import { SQSService } from './sqs.service';

@Global()
@Module({
  providers: [SQSService],
})
export class SQSModule {}
