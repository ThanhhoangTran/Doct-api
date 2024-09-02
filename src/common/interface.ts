import { EntityManager, FindOptionsWhere } from 'typeorm';

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
}
