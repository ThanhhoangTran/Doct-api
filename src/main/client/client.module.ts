import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from '../auth/auth.module';
import { TimeOpeningModule } from './apis/timeOpening/timeOpening.module';

import { DatabaseModule } from '../../modules/database.module';
import { JwtStrategy } from '../../service/jwt/strategies/jwt.strategy';
import { ConsultationScheduleModule } from './apis/consultationSchedule/consultationSchedule.module';
import { ConversationModule } from './apis/conversation/conversation.module';
import { ChatMessageModule } from './apis/chatMessage/chatMessage.module';
import { JwtCommonModule } from '../../modules/jwtModule.module';
@Module({
  imports: [
    DatabaseModule,
    JwtCommonModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/',
      playground: true,
      autoSchemaFile: '../../tmp/schemaClient.gql',
      sortSchema: true,
      include: [AuthModule, TimeOpeningModule, ConsultationScheduleModule, ConversationModule, ChatMessageModule],
    }),
    AuthModule,
    TimeOpeningModule,
    ConsultationScheduleModule,
    ConversationModule,
    ChatMessageModule,
  ],
  providers: [JwtStrategy],
})
export class ClientModule {}
