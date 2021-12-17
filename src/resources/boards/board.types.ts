// board.types.ts

import { FastifyRequest } from 'fastify';

import { genId } from '../../common/utils';
import { IColumn } from './column.types';

export type BoardId = ReturnType<typeof genId>;

export interface IBoardId {
  boardId: BoardId;
}

export interface IBoard {
  title: string;
  columns: IColumn[];
}

export interface IBoardService {
  boardExists(boardId: BoardId): Promise<boolean>;
}

export type BoardGetRequest = FastifyRequest<{ Params: IBoardId }>;
export type BoardPostRequest = FastifyRequest<{ Body: IBoard }>;
export type BoardPutRequest = FastifyRequest<{
  Params: IBoardId;
  Body: IBoard;
}>;
export type BoardDeleteRequest = FastifyRequest<{ Params: IBoardId }>;

// __EOF__
