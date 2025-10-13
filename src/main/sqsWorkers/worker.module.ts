import { Module } from '@nestjs/common';
import { SQSWorkerHandler } from './worker.service';
import { SQS_INJECTION_TOKEN } from '../../common/constants';
import { TestProcessor } from './processors/testProcessor/processor';

@Module({
  providers: [
    SQSWorkerHandler,
    TestProcessor,
    {
      provide: SQS_INJECTION_TOKEN,
      useFactory: (...args) => args,
      inject: [TestProcessor],
    },
  ],
})
export class SQSWorkerModule {}
