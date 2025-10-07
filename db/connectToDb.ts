import { Connection, ConnectionManager, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';

import { clientDBConfig } from './dbconfig';

export class ConnectToDb {
  private connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  public async getConnection(connectionName = 'default', nodeEnv?: string): Promise<Connection> {
    let connection: Connection;
    if (this.connectionManager.has(connectionName)) {
      connection = this.connectionManager.get(connectionName);
      if (!connection.isConnected) {
        connection = await connection.connect();
      }
    } else {
      const connectionOptions: ConnectionOptions = clientDBConfig(nodeEnv);
      connection = await createConnection(connectionOptions);
    }

    return connection;
  }
}
