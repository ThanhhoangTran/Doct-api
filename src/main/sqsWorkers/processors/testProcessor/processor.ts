import { Injectable } from '@nestjs/common';
import { MessageInterface, SQSProcessorInterface } from '../../../../common/interface';
import { MESSAGE_TYPE } from '../../../../common/constants';

@Injectable()
export class TestProcessor implements SQSProcessorInterface {
  getMessageType(): string {
    return MESSAGE_TYPE.TestProcessor;
  }

  public async process(msg: MessageInterface): Promise<void> {
    const messageBody = JSON.parse(msg.body);
    console.log('Processing TestProcessor message:', messageBody);

    return;
  }
}
