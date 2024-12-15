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
          if (!authToken) {
            return {
              statusCode: 401,
              body: JSON.stringify({ message: 'Unauthorized: Missing auth token' }),
            };
          }

          const { message, error } = await connectionService.connectionHandler(sourceIp, connectionId, authToken);
          responseMessage = message;
          if (error) {
            return {
              statusCode: 401,
              body: JSON.stringify({ message: 'Unauthorized: Invalid token' }),
            };
          }
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

// export const testHandler = async () => {
//   const event = readFileSync('./mocker/events/notification.json', { encoding: 'utf-8' });
//   console.log('🚀 ~ testHandler ~ event:', event);
//   const notificationModule = await NestFactory.createApplicationContext(NotificationModule);
//   const notificationService = notificationModule.get(NotificationService);

//   await notificationService.connectionHandler('1', '2', 'otkencaksdfkjdkjankl-djksnf');
// };
