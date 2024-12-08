import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from '../auth/auth.module';
import { TimeOpeningModule } from './apis/timeOpening/timeOpening.module';

import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../../modules/database.module';
import { configuration } from '../../config';
import { JwtStrategy } from '../../service/jwt/strategies/jwt.strategy';
import { ConsultationScheduleModule } from './apis/consultationSchedule/consultationSchedule.module';
import { ConversationModule } from './apis/conversation/conversation.module';
import { ChatMessageModule } from './apis/chatMessage/chatMessage.module';
// import { PubSubModule } from '../../common/pubsub/pubsub.module';
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: configuration.jwt.secretKey,
      signOptions: { expiresIn: configuration.jwt.expiredIn },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/',
      playground: true,
      autoSchemaFile: '../../tmp/schemaClient.gql',
      sortSchema: true,
      //using SSE (server-send-event) => specify api need to get notification =>
      // subscriptions: {
      //   'graphql-ws': {
      //     onConnect: (context: any) => {
      //       console.log('🚀 ~ context:', context);
      //       return;
      //     },
      //   },
      // },
      include: [
        AuthModule,
        TimeOpeningModule,
        ConsultationScheduleModule,
        //  ConversationModule, ChatMessageModule
      ],
    }),
    AuthModule,
    TimeOpeningModule,
    ConsultationScheduleModule,
    // ConversationModule,
    // ChatMessageModule,
    // PubSubModule,
  ],
  providers: [JwtStrategy],
})
export class ClientModule {}
