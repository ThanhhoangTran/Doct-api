import { NestFactory } from '@nestjs/core';
import { APIGatewayProxyEventBase, APIGatewayProxyWebsocketEventV2, APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';
import { INestApplicationContext } from '@nestjs/common';
import { NotificationModule } from '../main/notification/notification.module';
import { NotificationService } from '../main/notification/notification.service';
import { ISocketGatewayRequestContext } from '../common/interface';

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2, context) => {
  console.log('🚀 ~ event:', JSON.stringify(event));

  let notificationModule: INestApplicationContext;

  try {
    const eventGateway = event as APIGatewayProxyEventBase<ISocketGatewayRequestContext>;
    const notificationModule = await NestFactory.createApplicationContext(NotificationModule);
    const notificationService = notificationModule.get(NotificationService);

    if (eventGateway.requestContext) {
      const {
        connectionId,
        eventType,
        identity: { sourceIp },
      } = eventGateway.requestContext;
      switch (eventType) {
        case 'CONNECT':
          let authToken = eventGateway.queryStringParameters?.token;

          console.log('🚀 ~ websocket connected');
          return await notificationService.connectionHandler(sourceIp, connectionId, authToken);

        case 'DISCONNECT':
          console.log('🚀 ~ websocket disconnected');
          // await notificationModule.disconnectHandler(sourceIp, connectionId);
          return {
            statusCode: 200,
            body: 'disconnected',
          };
        case 'MESSAGE':
          break;
      }
    }
  } catch (error) {
    console.log('🚀 ~ APIGatewayProxyWebsocketHandler ~ error:', error);
    notificationModule.close();
    throw error;
  }
};
