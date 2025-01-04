import { exec } from 'child_process';
import { PaginationDto } from '../common/dtos/queryFilter.dto';
import { MetaPaginationInterface } from '../common/response';
import { configuration } from '../config';
import { readFileSync } from 'fs';

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
  private readonly builder: any;
  private readonly pagination: PaginationDto;
  constructor(builder: any, pagination: PaginationDto) {
    this.builder = builder;
    this.pagination = pagination;
  }

  private async execPagination(pagination: PaginationDto) {
    const { pageNumber, pageSize } = pagination;
    const skipNumber = (pageNumber - 1) * pageSize;

    let items: any;
    let countNumber: number;

    if (this.builder['@instanceof']?.description === 'SelectQueryBuilder') {
      [items, countNumber] = await this.builder.skip(skipNumber).take(pageSize).getManyAndCount();
    } else {
      const query = this.builder.skip(skipNumber).limit(pageSize);
      items = await query.exec();
      countNumber = await this.builder.model.countDocuments(query.getFilter());
    }

    const meta: MetaPaginationInterface = {
      itemCount: items.length,
      totalItems: countNumber,
      itemsPerPage: pageSize,
      totalPages: Math.ceil(countNumber / pageSize),
      currentPage: pageNumber,
    };
    return { items, meta } as T;
  }

  async execute() {
    return await this.execPagination(this.pagination);
  }
}

export const executeLambdaEventTest = async (handler, sourceFile: string) => {
  const nodeEnv = configuration.api.nodeEnv;

  if (nodeEnv !== 'local') {
    return;
  }

  try {
    const event = readFileSync(sourceFile, { encoding: 'utf-8' });
    await handler(event);
  } catch (error) {
    throw error;
  }
};
