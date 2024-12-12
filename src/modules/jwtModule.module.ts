import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { configuration } from '../config';

@Module({
  imports: [
    JwtModule.register({
      secret: configuration.jwt.secretKey,
      signOptions: { expiresIn: configuration.jwt.expiredIn },
    }),
  ],
  exports: [JwtModule],
})
export class JwtCommonModule {}
