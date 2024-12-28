import { ROUTE_KEY } from '../../../../common/constants';
export const ActionResponse = <T extends (typeof ROUTE_KEY)[keyof typeof ROUTE_KEY]>(action: T, body: any) => {
  return JSON.stringify({
    action,
    data: { ...body },
  });
};
