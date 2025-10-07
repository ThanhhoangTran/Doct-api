import { Inject, Injectable } from '@nestjs/common';
import { SQS_INJECTION_TOKEN } from '../../common/constants';
import { MessageInterface, SQSProcessorInterface } from '../../common/interface';
import { SQSEvent, SQSBatchResponse } from 'aws-lambda';

@Injectable()
export class SQSWorkerHandler {
  constructor(@Inject(SQS_INJECTION_TOKEN) private readonly sqsProcessors: SQSProcessorInterface[]) {}

  async processMessage(event: SQSEvent): Promise<SQSBatchResponse> {
    console.log('Processing SQS message:', JSON.stringify(event));
    const result: SQSBatchResponse = { batchItemFailures: [] };

    for (const record of event.Records) {
      console.log(`Processing message`, record);

      const { body } = record;
      const data: MessageInterface = JSON.parse(body);
      const processor = this.sqsProcessors.find(processor => processor.getMessageType() === data.messageType);

      if (!processor) {
        console.warn(`No processor found for message type ${data.messageType}`);
      }

      try {
        await processor.process(data);
      } catch (error) {
        console.log(error);
        // Sentry.captureException(error);
        result.batchItemFailures.push({ itemIdentifier: record.messageId });
      }
    }

    return result;
  }
}
