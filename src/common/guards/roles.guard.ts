import { ROLES_KEY } from '../decorators/roles.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLE_NAME_TYPE } from '../constants';
import { PermissionError } from '../exceptions/permissionError';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this._reflector.getAllAndOverride<ROLE_NAME_TYPE[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    const {
      req: { user },
    } = ctx.getContext();

    const allowedAccess = requiredRoles.some(role => user.role.name === role);
    if (!allowedAccess) {
      throw new PermissionError("You don't have permission for this action", requiredRoles);
    }
    return allowedAccess;
  }
}
