import { SendMessageCommand, SendMessageCommandOutput, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { configuration } from '../../../config';
import { SendMessageSQSInputDto } from './dtos/sendMessageSQSInputDto';
import { APP_ENV } from '../../../common/constants';

@Injectable()
export class SQSService {
  private _sqsClient: SQSClient;

  constructor() {
    this._sqsClient = new SQSClient({ region: configuration.aws.region });
  }

  public async sendMessage(input: SendMessageSQSInputDto): Promise<SendMessageCommandOutput> {
    const { queueUrl, messageBody, delaySeconds } = input;

    if (!configuration.aws.allowRealAws || APP_ENV.LOCAL === configuration.api.nodeEnv) {
      throw new Error('Local-safe policy: blocked sending message to real AWS SQS in local environment');
    }

    const params = {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
      DelaySeconds: delaySeconds,
    };

    const command = new SendMessageCommand(params);
    return await this._sqsClient.send(command);
  }
}
