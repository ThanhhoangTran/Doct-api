import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyEventBase, APIGatewayProxyWebsocketEventV2, APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';
import { INestApplicationContext } from '@nestjs/common';
import { NotificationModule } from '../main/notification/notification.module';
import { NotificationService } from '../main/notification/notification.service';
import { ISocketGatewayRequestContext } from '../common/interface';

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2, context) => {
  console.log('🚀 ~ event:', JSON.stringify(event));

  let notificationModule: INestApplicationContext;
  let responseMessage: string | undefined;

  try {
    const eventGateway = event as APIGatewayProxyEventBase<ISocketGatewayRequestContext>;
    const notificationModule = await NestFactory.createApplicationContext(NotificationModule);
    const notificationService = notificationModule.get(NotificationService);

    if (eventGateway.requestContext) {
      const {
        connectionId,
        eventType,
        routeKey,
        domainName,
        stage,
        identity: { sourceIp },
      } = eventGateway.requestContext;

      console.log(`🚀 websocket - eventType: ${eventType}`);

      switch (eventType) {
        case 'CONNECT': {
          const authToken = eventGateway.queryStringParameters?.token;
          if (!authToken) {
            return {
              statusCode: 401,
              body: JSON.stringify({ message: 'Unauthorized: Invalid token' }),
            };
          }

          responseMessage = await notificationService.connectionHandler(sourceIp, connectionId, authToken);
          break;
        }

        case 'DISCONNECT':
          responseMessage = await notificationService.disconnectHandler(connectionId);
          break;

        case 'MESSAGE':
          const endpointUrl = `https://${domainName}/${stage}`;
          await notificationService.notificationHandler({ routeKey, callbackUrl: endpointUrl, body: event.body, connectionId });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: responseMessage }),
    };
  } catch (error) {
    console.log('🚀 ~ APIGatewayProxyWebsocketHandler ~ error:', error);
    if (notificationModule) {
      await notificationModule.close();
    }

    throw error;
  }
};

// export const testHandler = async () => {
//   const event = readFileSync('./mocker/events/notification.json', { encoding: 'utf-8' });
//   console.log('🚀 ~ testHandler ~ event:', event);
//   const notificationModule = await NestFactory.createApplicationContext(NotificationModule);
//   const notificationService = notificationModule.get(NotificationService);

//   await notificationService.connectionHandler('1', '2', 'otkencaksdfkjdkjankl-djksnf');
// };
