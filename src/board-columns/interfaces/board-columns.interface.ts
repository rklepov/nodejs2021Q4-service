// board-columns.interface.ts

import { UUIDString } from '../../common/types';
import { BoardId } from '../../boards/interfaces/board.interface';

export type BoardColumnId = UUIDString;

export interface IBoardColumn {
  columnId?: BoardColumnId;

  title: string;

  order: number;

  boardId?: BoardId;
}

// __EOF__
