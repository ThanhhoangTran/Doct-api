import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { configuration } from '../config';
import { loadEntitiesAndMigrations } from './entities-migrations-loader';
import { APP_ENV } from '@/common/constants';

export const ormconfig = async (hardCodeEnv?: string) => {
  const nodeEnv = hardCodeEnv ? hardCodeEnv : configuration.api.nodeEnv;

  let typeOrmConfig: DataSourceOptions = {
    ...loadEntitiesAndMigrations(),
    type: 'postgres',

    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      max: 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    },
  };
  if (nodeEnv === APP_ENV.TEST) {
    typeOrmConfig = {
      ...typeOrmConfig,
      url: configuration.database.connectionString,
    };
  }
  if (nodeEnv === APP_ENV.LOCAL) {
    typeOrmConfig = {
      ...typeOrmConfig,
      url: configuration.database.connectionString,
    };
  }
  if ([APP_ENV.STAGING, APP_ENV.UAT, APP_ENV.RELEASE].includes(nodeEnv)) {
    /* Get uri connect to db cloud - dev & uat & release environment */
    typeOrmConfig = {
      ...typeOrmConfig,
      url: configuration.database.connectionString,
    };
  }

  return typeOrmConfig;
};
