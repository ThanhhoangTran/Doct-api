import { APIGatewayProxyWebsocketEventV2, APIGatewayProxyWebsocketHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyWebsocketHandlerV2 = async (event: APIGatewayProxyWebsocketEventV2, context) => {
  console.log('🚀 ~ event:', JSON.stringify(event));
  let message = '';
  if (event.requestContext) {
    if (event.requestContext.eventType === 'CONNECT') {
      console.log('🚀 ~ websocket connected:');
      message = 'connected';
    }
    if (event.requestContext.eventType === 'DISCONNECT') {
      console.log('🚀 ~ websocket disconnected:');
      message = 'disconnected';
    }
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(message),
  };
  return response;
};
