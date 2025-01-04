import { Injectable } from '@nestjs/common';
import { ConnectionFakePayload } from './dtos/connectionFakePayload';
import { ConnectionService } from '../connection/connection.service';
import { ConnectionPayload, UserContextInterface } from '../../common/interface';
import { randomUUID } from 'crypto';

@Injectable()
export class FakeConnectionService {
  private connectionId: string;
  constructor(private readonly _connectionServiceMocker: ConnectionService) {
    this.connectionId = randomUUID();
  }

  public async handle(body: ConnectionFakePayload, user: UserContextInterface): Promise<string> {
    await this._connectionServiceMocker.connectionHandler('127.0.0.1', this.connectionId, user.id);
    const preparedPayload: ConnectionPayload = {
      routeKey: body.action,
      body: JSON.stringify(body),
      callbackUrl: null,
      connectionId: this.connectionId,
    };

    await this._connectionServiceMocker.process(preparedPayload);
    await this._connectionServiceMocker.disconnectHandler(this.connectionId);
    return 'Fake connection is process successfully!';
  }
}
