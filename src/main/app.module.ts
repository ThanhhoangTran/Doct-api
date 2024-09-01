import { DatabaseModule } from '@/modules/database.module';
import { Module } from '@nestjs/common';
import { I18n_Module } from '@/modules/i18n.module';
import { ClientModule } from './client/client.module';
import { JwtModule } from '@nestjs/jwt';
import { configuration } from '@/config';
import { JwtStrategy } from '@/service/jwt/strategies/jwt.strategy';

@Module({
  imports: [
    ClientModule,
    DatabaseModule,
    I18n_Module,
    JwtModule.register({
      secret: configuration.jwt.secretKey,
      signOptions: { expiresIn: configuration.jwt.expiredIn },
    }),
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
