import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { loadEntitiesAndMigrations } from './entities-migrations-loader';
import { configuration } from '../src/config';

export const clientDBConfig = (): DataSourceOptions => ({
  ...loadEntitiesAndMigrations(),
  type: 'postgres',
  namingStrategy: new SnakeNamingStrategy(),
  extra: {
    max: 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  },
  ssl: {
    rejectUnauthorized: false,
  },

  url: configuration.database.system.connectionString,
});
