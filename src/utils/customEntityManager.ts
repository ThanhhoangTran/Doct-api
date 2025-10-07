import { DataSource, EntityManager } from 'typeorm';
import { clientDBConfig } from '../../db/dbconfig';
import { configuration } from '../config';

export class CustomDataSourceManager {
  private dataSource: DataSource;
  public constructor() {
    this.dataSource = new DataSource(clientDBConfig(configuration.api.nodeEnv));
  }

  public async initDataSource(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  public async initialTransaction(runInTransaction: (entityManager: EntityManager) => Promise<any>) {
    await this.initDataSource();
    return this.dataSource.transaction(runInTransaction);
  }

  public async getDataSource(): Promise<DataSource> {
    await this.initDataSource();
    return this.dataSource;
  }
}
