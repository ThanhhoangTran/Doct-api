import { UserContextInterface } from '../../../common/interface';

export type ConnectionHandlerType = {
  user?: UserContextInterface;
  error?: Error;
};
