import { UserContextInterface } from '../../../../../common/interface';

export type MakeConversationType = {
  createdBy: UserContextInterface;
  attendeeIDs: string[];
  roomName: string;
};
