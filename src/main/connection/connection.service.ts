import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserConnection } from '../../schemas/userConnection';
import { JwtService } from '@nestjs/jwt';
import { configuration } from '../../config';
import { ConnectionPayload, UserContextInterface } from '../../common/interface';
import { ROUTE_KEY } from '../../common/constants';
import { GatewayAdapter } from '../../service/aws/gateway';
import { MessageProcessorService } from './messageProcessor/message.service';
import { ConnectionHandlerType } from './types/connectionHandlerType';
import { ErrorMessage } from '../../errorMessages';

@Injectable()
export class ConnectionService {
  public constructor(
    @InjectModel(UserConnection.name) private readonly userConnection: Model<UserConnection>,
    private readonly jwtService: JwtService,
    private messageProcessService: MessageProcessorService,
  ) {}

  public async verifyUserAuthorization(token?: string | null): Promise<ConnectionHandlerType> {
    let userAuthorizationResult: ConnectionHandlerType = {};
    try {
      if (!token) {
        throw new Error('Unauthorized: Missing auth token');
      }

      const user: UserContextInterface = await this.jwtService.verifyAsync(token, { secret: configuration.jwt.secretKey });
      userAuthorizationResult.user = user;
    } catch (error) {
      userAuthorizationResult.error = error;
    }

    return userAuthorizationResult;
  }

  public async connectionHandler(sourceIp: string, connectionId: string, userId: string): Promise<string> {
    await this.userConnection.create({
      sourceIp,
      userId,
      connectionId,
    });

    return 'Web-Socket Connected Successfully';
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

      default:
        throw new BadRequestException(ErrorMessage.CONNECTION.ROUTE_KEY_NOT_FOUND);
    }
  }

  private async processVideoCalling(payload: ConnectionPayload) {}
}
