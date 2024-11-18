import { EntityManager, FindOptionsWhere } from 'typeorm';
import { RoleResponse } from './dtos/responses/roleResponse.dto';

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
