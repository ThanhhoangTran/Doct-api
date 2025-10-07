import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { loadEntitiesAndMigrations } from './entities-migrations-loader';
import { configuration } from '../src/config';
import { APP_ENV } from '../src/common/constants';

export const clientDBConfig = (nodeEnv?: string): DataSourceOptions => ({
  ...loadEntitiesAndMigrations(),
  type: 'postgres',
  namingStrategy: new SnakeNamingStrategy(),
  extra: {
    max: 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  },
  url: configuration.database.system.connectionString,
  ssl: {
    rejectUnauthorized: nodeEnv !== APP_ENV.LOCAL,
  },
});
