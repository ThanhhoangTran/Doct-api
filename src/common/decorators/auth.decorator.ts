import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ROLES_KEY } from './roles.decorator';

//scopes like ('roles', 'api-key', ...)
export function Auth(scopes?: string[]) {
  if (scopes && scopes.includes(ROLES_KEY)) {
    return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard));
  }
  return applyDecorators(UseGuards(JwtAuthGuard));
}
