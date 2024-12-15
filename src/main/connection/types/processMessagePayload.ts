import { GatewayAdapter } from '../../../service/aws/gateway';

export type ProcessMessagePayload = {
  connectionId: string;
  body: string;
  gateway: GatewayAdapter;
};

export type MessageContent = {
  content: string;
  conversationId: string;
  replyMessageId?: string | null;
  visibilityReceiverIds?: string[] | null;
};
