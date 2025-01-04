import { ApiGatewayManagementApi } from 'aws-sdk';
import { configuration } from '../../config';

export class GatewayAdapter {
  private apiGateway: ApiGatewayManagementApi;
  constructor(endpoint: string) {
    this.apiGateway = new ApiGatewayManagementApi({
      endpoint,
    });
  }

  public async sendToConnection(connectionId: string, payload: string): Promise<void> {
    if (process.env.APP_ENV === configuration.api.nodeEnv) {
      return;
    }

    try {
      await this.apiGateway
        .postToConnection({
          ConnectionId: connectionId,
          Data: payload,
        })
        .promise();
    } catch (error) {
      console.error(`Error sending data to connection ${connectionId}: ${error}`);
      throw error;
    }
  }
}
