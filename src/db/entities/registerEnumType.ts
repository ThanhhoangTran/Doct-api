import { ROLE_NAME } from '@/common/constants';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(ROLE_NAME, {
  name: 'ROLE_NAME',
});
