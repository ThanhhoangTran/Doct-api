import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { APIGatewayProxyHandler, Context } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import express from 'express';
import { Server } from 'http';
import { ClientModule } from '../main/client/client.module';

let cachedServer: Server;
let binaryMineTypes: string[] = [];

const bootstrapServer = async (): Promise<Server> => {
  if (!cachedServer) {
    try {
      const expressApp = express();
      const adapter = new ExpressAdapter(expressApp);
      const nestApp = await NestFactory.create(ClientModule, adapter, {
        logger: ['verbose', 'debug', 'warn', 'error'],
        cors: {
          origin: '*',
        },
      });
      nestApp.use(eventContext());
      await nestApp.init();
      return (cachedServer = createServer(expressApp, undefined, binaryMineTypes));
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return cachedServer;
};

export const handler: APIGatewayProxyHandler = async (event: any, context: Context) => {
  try {
    cachedServer = await bootstrapServer();

    return proxy(cachedServer, event as any, context, 'PROMISE').promise;
  } catch (error) {
    console.log('🚀 APIGatewayProxyHandler= ~ error:', error);
    throw error;
  }
};
