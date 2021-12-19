// column.types.ts

import { genId } from '../../common/utils';

/**
 * The unique **Id** of the column.
 */
export type ColumnId = ReturnType<typeof genId>;

/**
 * An abstraction of the object having **columnId** property (request message
 * and {@link Column} class)
 */
export interface IColumnId {
  columnId: ColumnId;
}

/**
 * An abstraction of the **Column** object.
 */
export interface IColumn {
  title: string;
  order: number;
}

// __EOF__
