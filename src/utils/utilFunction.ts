import { exec } from 'child_process';
import { SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '../common/dtos/queryFilter.dto';
import { MetaPaginationInterface } from '../common/response';

export const executeCommandLine = function (command: string) {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log(`The stdout Buffer from shell: ${stdout.toString()}`);
      console.log(`The stderr Buffer from shell: ${stderr.toString()}`);
    }
  });
};

export const notUndefined = <T>(value: T | undefined | null): value is T => {
  return typeof value !== 'undefined' && value !== null;
};

export class BuilderPaginationResponse<T> {
  private readonly builder: SelectQueryBuilder<unknown>;
  private readonly pagination: PaginationDto;
  constructor(builder: SelectQueryBuilder<unknown>, pagination: PaginationDto) {
    this.builder = builder;
    this.pagination = pagination;
  }
  private async execPagination(pagination: PaginationDto) {
    const { pageNumber, pageSize } = pagination;
    const skipNumber = (pageNumber - 1) * pageSize;

    const [items, countNumber] = await this.builder.skip(skipNumber).take(pageSize).getManyAndCount();

    const meta: MetaPaginationInterface = {
      itemCount: items.length,
      totalItems: countNumber,
      itemsPerPage: pageSize,
      totalPages: Math.ceil(countNumber / pageSize),
      currentPage: pageNumber,
    };
    return { items: items, meta } as T;
  }

  async execute() {
    return await this.execPagination(this.pagination);
  }
}
