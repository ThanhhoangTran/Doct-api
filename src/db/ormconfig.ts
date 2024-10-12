import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { loadEntitiesAndMigrations } from './entities-migrations-loader';
// import { APP_ENV } from '../common/constants';

export const ormconfig = async (hardCodeEnv?: string) => {
  // const nodeEnv = hardCodeEnv ? hardCodeEnv : configuration.api.nodeEnv;

  let typeOrmConfig: DataSourceOptions = {
    ...loadEntitiesAndMigrations(),
    type: 'postgres',

    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      max: 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    },
    username: 'postgres',
    password: 'hoang28022001',
    host: 'doct-instance.cxy0a6wguqib.ap-southeast-1.rds.amazonaws.com',
    port: 5432,
    database: 'doct_db',
    ssl: {
      rejectUnauthorized: false,
    },
  };

  // typeOrmConfig = {
  //   ...typeOrmConfig,
  //   url: configuration.database.connectionString,
  // };

  return typeOrmConfig;
};
