import { Injectable } from '@nestjs/common';

import { JwtBaseStrategy } from './jwtBase.strategy';
import { configuration } from '../../../config';
@Injectable()
export class JwtStrategy extends JwtBaseStrategy {
  constructor() {
    super(configuration.jwt.secretKey);
  }
}
