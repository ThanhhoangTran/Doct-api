export type SendMessageSQSInputDto = {
  queueUrl: string;
  messageBody: string;
  delaySeconds?: number;
};
