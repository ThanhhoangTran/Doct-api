import { Injectable } from '@nestjs/common';
import { TestProcessorMessage } from './types/input';
import { SQSPublisherInterface } from '../../../../common/interface';
import { DEFAULT_DELAY_SECONDS, MESSAGE_TYPE } from '../../../../common/constants';
import { SQSService } from '../../../../service/aws/sqs/sqs.service';
import { configuration } from '../../../../config';

@Injectable()
export class TestQueuePublisher implements SQSPublisherInterface<TestProcessorMessage> {
  constructor(private readonly _sqsService: SQSService) {}

  public async sendMessage(payload: TestProcessorMessage): Promise<void> {
    console.log('Publishing message to TestProcessor queue:', payload);

    const message = {
      messageType: MESSAGE_TYPE.TestProcessor,
      body: JSON.stringify(payload),
    };

    await this._sqsService.sendMessage({
      queueUrl: configuration.aws.queueUrl.normalQueueUrl,
      messageBody: JSON.stringify(message),
      delaySeconds: DEFAULT_DELAY_SECONDS,
    });
  }
}
