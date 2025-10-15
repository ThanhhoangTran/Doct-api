import { registerEnumType } from '@nestjs/graphql';
import { CONSULTATION_STATUS, CONSULTATION_TYPE, EVENT_TYPE, QUERY_OPERATORS, ROLE_NAME, USER_VERIFICATION_REQUEST_TYPE } from '../common/constants';

registerEnumType(ROLE_NAME, {
  name: 'RoleName',
});

registerEnumType(EVENT_TYPE, {
  name: 'EventType',
});

registerEnumType(CONSULTATION_TYPE, {
  name: 'ConsultationType',
});

registerEnumType(CONSULTATION_STATUS, {
  name: 'ConsultationStatus',
});

registerEnumType(QUERY_OPERATORS, {
  name: 'QueryOperator',
});

registerEnumType(USER_VERIFICATION_REQUEST_TYPE, {
  name: 'UserVerificationRequestType',
});
