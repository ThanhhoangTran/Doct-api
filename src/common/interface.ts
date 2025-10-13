import { EntityManager, FindOptionsWhere } from 'typeorm';
import { RoleResponse } from './dtos/responses/roleResponse.dto';
import { APIGatewayEventWebsocketRequestContextV2 } from 'aws-lambda';

export interface IBaseRepository<T> {
  getOneByCondition: (input: {
    condition: FindOptionsWhere<T>;
    throwErrorIfNotExisted: boolean;
    relations?: string[] | undefined;
    transaction?: EntityManager;
  }) => Promise<T | undefined>;
}

export interface UserContextInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  role: RoleResponse;
  stun: string;
}

export interface Getter<Input, Output = void> {
  execute?: (input: Input) => Output;
}

export interface ISocketGatewayRequestContext extends APIGatewayEventWebsocketRequestContextV2 {
  identity: {
    sourceIp: string;
  };
}

export interface ConnectionPayload {
  body: any;
  connectionId: string;
  routeKey: string;
  callbackUrl?: string | null;
}

export interface MessageInterface {
  messageType: string;
  body: string;
}
export interface SQSProcessorInterface {
  getMessageType(): string;
  process(msg: MessageInterface): Promise<void>;
}

export interface SQSPublisherInterface<T> {
  sendMessage(payload: T, delay?: number): Promise<void>;
}
