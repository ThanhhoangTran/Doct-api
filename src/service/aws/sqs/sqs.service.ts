import { SendMessageCommand, SendMessageCommandOutput, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { configuration } from '../../../config';
import { SendMessageSQSInputDto } from './dtos/sendMessageSQSInputDto';

@Injectable()
export class SQSService {
  private _sqsClient: SQSClient;

  constructor() {
    this._sqsClient = new SQSClient({ region: configuration.aws.region });
  }

  public async sendMessage(input: SendMessageSQSInputDto): Promise<SendMessageCommandOutput> {
    const { queueUrl, messageBody, delaySeconds } = input;

    const params = {
      QueueUrl: queueUrl,
      MessageBody: messageBody,
      DelaySeconds: delaySeconds,
    };

    const command = new SendMessageCommand(params);
    return await this._sqsClient.send(command);
  }
}
