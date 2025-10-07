/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { configuration } from '../config';
import { ChatMessage, ChatMessageSchema } from '../schemas/chatMessage.schema';
import { Conversation, ConversationSchema } from '../schemas/conversation.schema';
import { UserConnection, UserConnectionSchema } from '../schemas/userConnection';
import { clientDBConfig } from '../../db/dbconfig';

const MONGODB_SCHEMAS = [
  { name: UserConnection.name, schema: UserConnectionSchema },
  { name: Conversation.name, schema: ConversationSchema },
  { name: ChatMessage.name, schema: ChatMessageSchema },
];

const createMongoConfig = (): MongooseModuleFactoryOptions => ({
  uri: configuration.database.chatMessage.connectionString,
  retryAttempts: 3,
  connectionFactory: (connection: any) => {
    console.log('✅ Connected to MongoDB successfully');

    // Add event listeners for better error tracking
    connection.on('error', (error: any) => {
      console.error('❌ MongoDB connection error:', error);
    });

    connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return connection;
  },
  connectionErrorFactory: (error: any) => {
    console.error('❌ MongoDB connection failed:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
    });
    throw error;
  },
});

// PostgreSQL connection configuration
const createPostgresConfig = (): TypeOrmModuleOptions => {
  const dbConfig = clientDBConfig(configuration.api.nodeEnv);
  return {
    ...dbConfig,
    keepConnectionAlive: true,
    logging: true,
    migrationsRun: true,
  };
};

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: createMongoConfig,
    }),
    // MongoDB schemas
    MongooseModule.forFeature(MONGODB_SCHEMAS),

    // PostgreSQL connection
    TypeOrmModule.forRootAsync({
      useFactory: createPostgresConfig,
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
