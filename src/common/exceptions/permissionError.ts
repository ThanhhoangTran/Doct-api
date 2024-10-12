import { GraphQLError } from 'graphql';
import { ErrorMessage } from '../../i18n';

export class PermissionError extends GraphQLError {
  extensions: {};

  constructor(message: string, requiredPermission: string[], code: string = ErrorMessage.UNAUTHORIZED) {
    super(message);
    this.message = message;
    this.extensions = { code, permission: requiredPermission };
  }
}
