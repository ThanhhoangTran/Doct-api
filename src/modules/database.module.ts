import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from '../../db/dbconfig';
import { MongooseModule } from '@nestjs/mongoose';
import { configuration } from '../config';
import { ChatMessage, ChatMessageSchema } from '../schemas/chatMessage.schema';
import { Conversation, ConversationSchema } from '../schemas/conversation.schema';
import { UserConnection, UserConnectionSchema } from '../schemas/userConnection';

export const mongooseModules = () => {
  return [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: configuration.database.chatMessage.connectionString,
        ssl: true,
        connectionFactory: connection => {
          console.log('Connected to MongoDB');
          return connection;
        },
        connectionErrorFactory: error => {
          console.error('Connection to MongoDB error:', error);
          throw error;
        },
      }),
    }),
    MongooseModule.forFeature([
      {
        name: UserConnection.name,
        schema: UserConnectionSchema,
      },
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
      {
        name: ChatMessage.name,
        schema: ChatMessageSchema,
      },
    ]),
  ];
};

@Global()
@Module({
  imports: [
    ...mongooseModules(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const dbConfig = ormconfig();
        return {
          ...dbConfig,
          keepConnectionAlive: true,
          logging: true,
          migrationsRun: true,
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
