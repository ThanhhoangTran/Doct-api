export const APP_ENV = {
  LOCAL: 'local',
  DEV: 'dev',
  TEST: 'test',
};

export const QUERY_OPERATORS = {
  IN: 'in',
  NOT_IN: 'nin',
  EQUAL: 'equal',
  NOT_EQUAL: 'not_equal',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  GREATER_THAN_EQUAL: 'greater_than_equal',
  LESS_THAN_EQUAL: 'less_than_equal',
};

export type ENUM_TYPE<T extends object> = T[keyof T];

export const USER_VERIFICATION_REQUEST_TYPE = {
  RESET_PASSWORD: 'reset_password',
} as const;

export const ROLE_NAME = {
  SUPER_ADMIN: 'super_admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
};

export type ROLE_NAME_TYPE = ENUM_TYPE<typeof ROLE_NAME>;

export type USER_VERIFICATION_REQUEST = ENUM_TYPE<typeof USER_VERIFICATION_REQUEST_TYPE>;

export const SELECT_USER = ['firstName', 'lastName', 'email', 'id', 'role', 'fullName'];

export const EVENT_TYPE = {
  APPOINTMENT: 'appointment',
  MEETING: 'meeting',
  OPERATION: 'operation',
};

export const CONSULTATION_TYPE = {
  CLINIC: 'clinic',
  VIDEO: 'video',
};

export const CONSULTATION_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
  WAITING: 'waiting',
};

export const INJECTION_TOKEN = {
  PUB_SUB: 'PUB_SUB',
};

export const ROUTE_KEY = {
  NOTIFICATION: 'notification',
  VIDEO_CALL: 'video_call',
  MESSAGE: 'message',
} as const;

export const SQS_INJECTION_TOKEN = 'SQS_INJECTION_TOKEN';
export const MESSAGE_TYPE = {
  TestProcessor: 'TestProcessor',
};

export const DEFAULT_DELAY_SECONDS = 0;
