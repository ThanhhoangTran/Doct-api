import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SQSEvent } from 'aws-lambda';
import { SQSWorkerModule } from '../main/sqsWorkers/worker.module';
import { SQSWorkerHandler } from '../main/sqsWorkers/worker.service';

export let sqsMsgApp: INestApplicationContext;

export const handler = async (event: SQSEvent) => {
  console.log('🚀 Receive:', JSON.stringify(event));

  if (!sqsMsgApp) {
    sqsMsgApp = await NestFactory.createApplicationContext(SQSWorkerModule);
  }

  const handler = sqsMsgApp.select(SQSWorkerModule).get(SQSWorkerHandler, { strict: true });

  return await handler.processMessage(event);
};
