import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { IBaseRepository } from './interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T> extends Repository<T> implements IBaseRepository<T> {
  public async getOneByCondition({
    throwErrorIfNotExisted = true,
    transaction = this.manager,
    condition,
    relations,
  }: {
    condition: FindOptionsWhere<T>;
    throwErrorIfNotExisted?: boolean;
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

  public async updatePartial(condition: FindOptionsWhere<T>, entityPartial: QueryDeepPartialEntity<T>, transaction = this.manager): Promise<void> {
    await transaction.update(this.target, condition, entityPartial);
  }
}
