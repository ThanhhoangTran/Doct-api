require('dotenv').config();

export const configuration = {
  api: {
    nodeEnv: process.env.APP_ENV || 'local',
  },
  domain: process.env.DOMAIN || 'localhost',
  sentryKey: process.env.SENTRY_DSN,
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  database: {
    system: {
      connectionString: process.env.DB_URL || '',
    },
    chatMessage: {
      connectionString: process.env.DB_MESSAGE_URL || '',
    },
  },
  jwt: {
    secretKey: process.env.JWT_SECRET || 'doctapi@123',
    refreshSecretKey: process.env.JWT_REFRESH_SECRET || 'doctapi@123',
    expiredIn: '300s',
  },
  timeout: process.env.TIME_OUT || 100000,
  bcrypt: {
    salt: process.env.SALT_ROUND || 5,
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    s3BucketName: process.env.S3_BUCKET,
    mainQueueUrl: process.env.MAIN_QUEUE_URL,
  },
};
