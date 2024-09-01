import { messageKey } from '@/i18n';
import { GraphQLError } from 'graphql';

export class PermissionError extends GraphQLError {
  extensions: {};

  constructor(message: string, requiredPermission: string[], code: string = messageKey.UNAUTHORIZED) {
    super(message);
    this.message = message;
    this.extensions = { code, permission: requiredPermission };
  }
}
