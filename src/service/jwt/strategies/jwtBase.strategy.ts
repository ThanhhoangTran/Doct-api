import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export abstract class JwtBaseStrategy extends PassportStrategy(Strategy) {
  constructor(secretKey: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: any): Promise<unknown> {
    return payload;
  }
}
