import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { APIGatewayProxyHandler, Context } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import express from 'express';
import { Server } from 'http';
import { ClientModule } from '../main/client/client.module';
import sentry from '@sentry/node';
import { configuration } from '../config';

let cachedServer: Server;
let binaryMineTypes: string[] = [];

const { dsn, tracesSampleRate } = configuration.sentry;

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

sentry.init({
  dsn: dsn,
  tracesSampleRate: tracesSampleRate,
});

export const handler: APIGatewayProxyHandler = async (event: any, context: Context) => {
  try {
    cachedServer = await bootstrapServer();

    return proxy(cachedServer, event as any, context, 'PROMISE').promise;
  } catch (error) {
    sentry.captureEvent(event);
    sentry.captureException(error);
    throw error;
  }
};
