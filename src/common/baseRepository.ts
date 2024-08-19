import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { IBaseRepository } from './interface';

export class BaseRepository<T> extends Repository<T> implements IBaseRepository<T> {
  async getOneByCondition({
    throwErrorIfNotExisted = true,
    transaction = this.manager,
    condition,
    relations,
  }: {
    condition: FindOptionsWhere<T>;
    throwErrorIfNotExisted: boolean;
    relations?: string[] | undefined;
    transaction?: EntityManager;
  }): Promise<T | undefined> {
    const object: T | undefined = await transaction.findOne<T>(this.target, {
      where: condition,
      relations: relations ?? [],
    });

    if (!object && throwErrorIfNotExisted) {
      throw new Error(`Cannot find ${this.target.toString()} with condition: ${JSON.stringify(condition)}`);
    }
    return object;
  }
}
