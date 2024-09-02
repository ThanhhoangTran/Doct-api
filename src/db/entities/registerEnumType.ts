import { EVENT_TYPE, QUERY_OPERATORS, ROLE_NAME } from '@/common/constants';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(ROLE_NAME, {
  name: 'ROLE_NAME',
});

registerEnumType(QUERY_OPERATORS, {
  name: 'QUERY_OPERATORS',
});

registerEnumType(EVENT_TYPE, {
  name: 'EVENT_TYPE',
});
