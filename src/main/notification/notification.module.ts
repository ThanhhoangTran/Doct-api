import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configuration } from '../../config';
import { UserConnection, UserConnectionSchema } from '../../schemas/userConnection';
import { NotificationService } from './notification.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

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
    MongooseModule.forFeature([
      {
        name: UserConnection.name,
        schema: UserConnectionSchema,
      },
    ]),

    JwtModule.register({
      secret: configuration.jwt.secretKey,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [NotificationService],
})
export class NotificationModule {}
