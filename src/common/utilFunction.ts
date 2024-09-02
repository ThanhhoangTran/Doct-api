import { exec } from 'child_process';
import { SelectQueryBuilder } from 'typeorm';
import { BaseQueryFilterDto } from './dtos/queryFilter.dto';
import { count } from 'console';
import { MetaPaginationInterface } from './response';

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

export class BuilderPaginationResponse<T> {
  private readonly builder: SelectQueryBuilder<unknown>;
  private readonly queryFilter: BaseQueryFilterDto;
  constructor(builder: SelectQueryBuilder<unknown>, queryFilter: BaseQueryFilterDto) {
    this.builder = builder;
    this.queryFilter = queryFilter;
  }
  private async execPagination(filter: BaseQueryFilterDto) {
    const { pageNumber, pageSize } = filter;
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
    return await this.execPagination(this.queryFilter);
  }
}
