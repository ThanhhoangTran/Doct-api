import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyEventBase, APIGatewayProxyWebsocketEventV2, APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';
import { INestApplicationContext } from '@nestjs/common';
import { ISocketGatewayRequestContext } from '../common/interface';
import { ConnectionModule } from '../main/connection/connection.module';
import { ConnectionService } from '../main/connection/connection.service';

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2, context) => {
  console.log('🚀 ~ event:', JSON.stringify(event));

  let connectionModule: INestApplicationContext;
  let responseMessage: string | undefined;

  try {
    const eventGateway = event as APIGatewayProxyEventBase<ISocketGatewayRequestContext>;
    const connectionModule = await NestFactory.createApplicationContext(ConnectionModule);
    const connectionService = connectionModule.get(ConnectionService);

    if (eventGateway.requestContext) {
      const {
        connectionId,
        eventType,
        routeKey,
        domainName,
        stage,
        identity: { sourceIp },
      } = eventGateway.requestContext;

      switch (eventType) {
        case 'CONNECT': {
          const authToken = eventGateway.queryStringParameters?.token;
          const { user, error } = await connectionService.verifyUserAuthorization(authToken);

          if (error) {
            return {
              statusCode: 401,
            };
          }

          responseMessage = await connectionService.connectionHandler(sourceIp, connectionId, user.id);
          break;
        }

        case 'DISCONNECT': {
          responseMessage = await connectionService.disconnectHandler(connectionId);
          break;
        }

        default: {
          const endpointUrl = `https://${domainName}/${stage}`;
          await connectionService.process({ routeKey, callbackUrl: endpointUrl, body: event.body, connectionId });
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: responseMessage }),
    };
  } catch (error) {
    console.log('🚀 ~ APIGatewayProxyWebsocketHandler ~ error:', error);
    if (connectionModule) {
      await connectionModule.close();
    }
  }
};
