import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from '../../db/dbconfig';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
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
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: 'mongodb://thanhhoang280202:tfUPO0f3ElGQHQRv@doct-db-shard-00-00.01zqq.mongodb.net:27017,doct-db-shard-00-01.01zqq.mongodb.net:27017,doct-db-shard-00-02.01zqq.mongodb.net:27017/?replicaSet=atlas-94r7h8-shard-0&authSource=admin&retryWrites=true&w=majority&appName=doct-db',
        ssl: true,
        connectionFactory: connection => {
          console.log('Connected to MongoDB:', connection.name);
          return connection;
        },
        connectionErrorFactory: error => {
          console.error('Connection error:', error);
          throw error;
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
