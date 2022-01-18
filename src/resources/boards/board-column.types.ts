// column.types.ts

import { UUIDString } from '../../common/utils';

/**
 * The unique **Id** of the column.
 */
export type BoardColumnId = UUIDString;

/**
 * An abstraction of the object having **columnId** property (request message
 * and {@link Column} class)
 */
export interface IBoardColumnId {
  columnId: BoardColumnId;
}

/**
 * An abstraction of the **Column** object.
 */
export interface IBoardColumn {
  title: string;
  order: number;
}

// __EOF__
