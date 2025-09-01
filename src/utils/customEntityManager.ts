import { DataSource, EntityManager } from 'typeorm';
import { clientDBConfig } from '../../db/dbconfig';

export class CustomDataSourceManager {
  private dataSource: DataSource;
  public constructor() {
    this.dataSource = new DataSource(clientDBConfig());
  }

  public async initDataSource() {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  public async initialTransaction(runInTransaction: (entityManager: EntityManager) => Promise<any>) {
    await this.initDataSource();
    return this.dataSource.transaction(runInTransaction);
  }

  public async getDataSource() {
    await this.initDataSource();
    return this.dataSource;
  }
}
