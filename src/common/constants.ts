export const APP_ENV = {
  LOCAL: 'local',
  STAGING: 'staging',
  UAT: 'uat',
  RELEASE: 'release',
  TEST: 'test',
};

export type ENUM_TYPE<T extends Object> = T[keyof T];

export const USER_VERIFICATION_REQUEST_TYPE = {
  RESET_PASSWORD: 'reset_password',
} as const;

export const ROLE_NAME = {
  SUPER_ADMIN: 'super_admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
} as const;

export type ROLE_NAME_TYPE = ENUM_TYPE<typeof ROLE_NAME>;

export type USER_VERIFICATION_REQUEST = ENUM_TYPE<typeof USER_VERIFICATION_REQUEST_TYPE>;
