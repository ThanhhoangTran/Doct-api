import { Module } from '@nestjs/common';
import { SQSWorkerHandler } from './worker.service';
import { SQS_INJECTION_TOKEN } from '../../common/constants';

@Module({
  providers: [
    SQSWorkerHandler,
    {
      provide: SQS_INJECTION_TOKEN,
      useFactory: (...args) => args,
      inject: [],
    },
  ],
})
export class SQSWorkerModule {}
