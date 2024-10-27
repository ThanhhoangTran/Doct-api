import { Column, ColumnOptions } from 'typeorm';

export const VirtualColumn = (options?: Omit<ColumnOptions, 'select' | 'insert' | 'update'>) => {
  Column({ ...(options ?? {}), select: false, insert: false, update: false });
};

export const BinaryTypeColumn = (options?: Omit<ColumnOptions, 'generated' | 'transformer'>, transformer?: any) =>
  Column({
    ...(options ?? {}),
    type: 'binary',
    transformer,
  });
