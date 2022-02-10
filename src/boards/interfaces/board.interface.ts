// board.interface.ts

import { UUIDString } from '../../common/types';

export type BoardId = UUIDString;

export interface IBoard {
  boardId: BoardId;

  title: string;
}

// __EOF__
