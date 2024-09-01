import { SetMetadata } from '@nestjs/common';
import { ROLE_NAME_TYPE } from '../constants';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: ROLE_NAME_TYPE[]) => SetMetadata(ROLES_KEY, roles);
