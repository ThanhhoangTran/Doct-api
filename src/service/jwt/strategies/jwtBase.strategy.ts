import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';

export abstract class JwtBaseStrategy extends PassportStrategy(Strategy) {
  constructor(secretKey: string, fromRequest: string | JwtFromRequestFunction = ExtractJwt.fromAuthHeaderAsBearerToken()) {
    super({
      jwtFromRequest: fromRequest,
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: any): Promise<unknown> {
    return payload;
  }
}
