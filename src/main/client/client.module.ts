import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from '../auth/auth.module';
import { TimeOpeningModule } from './apis/timeOpening/timeOpening.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/playground/client',
      autoSchemaFile: join(process.cwd(), 'schemaClient.gql'),
      sortSchema: true,
      include: [AuthModule, TimeOpeningModule],
    }),
    AuthModule,
    TimeOpeningModule
  ],
})
export class ClientModule {}
