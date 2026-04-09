import { Global, Module } from '@nestjs/common';
import { SQSService } from './sqs.service';
import { SESService } from '../ses/ses.service';

@Global()
@Module({
  providers: [SQSService, SESService],
  exports: [SQSService, SESService],
})
export class AwsModule {}
