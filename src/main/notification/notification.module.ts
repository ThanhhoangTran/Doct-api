import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configuration } from '../../config';
import { UserConnection, UserConnectionSchema } from '../../schemas/userConnection';
import { NotificationService } from './notification.service';
import { JwtCommonModule } from '../../modules/jwtModule.module';
import { ChatMessage, ChatMessageSchema } from '../../schemas/chatMessage.schema';
import { Conversation, ConversationSchema } from '../../schemas/conversation.schema';

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
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
      {
        name: ChatMessage.name,
        schema: ChatMessageSchema,
      },
    ]),
    JwtCommonModule,
  ],
  providers: [NotificationService],
})
export class NotificationModule {}
