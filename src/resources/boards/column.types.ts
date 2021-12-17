// column.types.ts

import { genId } from '../../common/utils';

export type ColumnId = ReturnType<typeof genId>;

export interface IColumnId {
  columnId: ColumnId;
}

export interface IColumn {
  title: string;
  order: number;
}

// __EOF__
