import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserConnection } from '../../schemas/userConnection';
import { JwtService } from '@nestjs/jwt';
import { configuration } from '../../config';
import { ConnectionPayload, UserContextInterface } from '../../common/interface';
import { ROUTE_KEY } from '../../common/constants';
import { GatewayAdapter } from '../../service/aws/gateway';
import { ConnectionHandlerType } from './types/connectionHandlerType';
import { MessageProcessorService } from './messageProcessor/message.service';

@Injectable()
export class ConnectionService {
  public constructor(
    @InjectModel(UserConnection.name) private readonly userConnection: Model<UserConnection>,
    private readonly jwtService: JwtService,
    private messageProcessService: MessageProcessorService,
  ) {}

  public async connectionHandler(sourceIp: string, connectionId: string, authToken: string): Promise<ConnectionHandlerType> {
    let resultConnection: ConnectionHandlerType = {
      message: '',
    };

    try {
      const user: UserContextInterface = await this.jwtService.verifyAsync(authToken, { secret: configuration.jwt.secretKey });
      await this.userConnection.create({
        sourceIp,
        userId: user.id,
        connectionId,
      });

      resultConnection.message = 'Web-Socket Connected Successfully';
    } catch (error) {
      resultConnection.error = error;
    }
    return resultConnection;
  }

  public async disconnectHandler(connectionId: string): Promise<string> {
    await this.userConnection.deleteOne({
      connectionId,
    });

    return 'Web-Socket Disconnected Successfully';
  }

  public async process(payload: ConnectionPayload): Promise<void> {
    const { connectionId, routeKey, body, callbackUrl } = payload;
    if (!connectionId) {
      return;
    }

    const gatewayAdapter = new GatewayAdapter(callbackUrl);
    console.log('🚀 ConnectionService - process', routeKey);

    switch (routeKey) {
      case ROUTE_KEY.MESSAGE: {
        await this.messageProcessService.process({
          connectionId,
          body,
          gateway: gatewayAdapter,
        });
        break;
      }
      case ROUTE_KEY.VIDEO_CALL: {
      }
    }
  }

  private async processVideoCalling(payload: ConnectionPayload) {}
}
