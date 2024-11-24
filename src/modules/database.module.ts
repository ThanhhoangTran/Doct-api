import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from '../../db/dbconfig';
import { MongooseModule } from '@nestjs/mongoose';
import { configuration } from '../config';

@Module({
  imports: [
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
})
export class DatabaseModule {}
