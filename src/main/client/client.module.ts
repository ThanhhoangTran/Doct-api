import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from '../auth/auth.module';
import { TimeOpeningModule } from './apis/timeOpening/timeOpening.module';

import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../../modules/database.module';
import { configuration } from '../../config';
import { JwtStrategy } from '../../service/jwt/strategies/jwt.strategy';
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
      autoSchemaFile: join(process.cwd(), 'schemaClient.gql'),
      sortSchema: true,
      include: [AuthModule, TimeOpeningModule],
    }),
    AuthModule,
    TimeOpeningModule,
  ],

  providers: [JwtStrategy],
})
export class ClientModule {}
