import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserConnection } from '../../schemas/userConnection';
import { JwtService } from '@nestjs/jwt';
import { configuration } from '../../config';
import { UserContextInterface } from '../../common/interface';

@Injectable()
export class NotificationService {
  public constructor(
    @InjectModel(UserConnection.name) private readonly userConnection: Model<UserConnection>,
    private readonly jwtService: JwtService,
  ) {}

  public async connectionHandler(sourceIp: string, connectionId: string, authToken?: string) {
    const user: UserContextInterface = this.jwtService.verify(authToken, { secret: configuration.jwt.secretKey });
    console.log('🚀 ~ NotificationService ~ JWT ~ payload:', user);

    if (!authToken || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized: Invalid token' }),
      };
    }

    await this.userConnection.create({
      sourceIp,
      userId: user.id,
      connectionId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Connected Successfully' }),
    };
  }

  public async disconnectHandler(connectionId: string) {}
}
