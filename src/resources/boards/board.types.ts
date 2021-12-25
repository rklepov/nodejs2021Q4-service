// board.types.ts

import { FastifyRequest } from 'fastify';

import { genId } from '../../common/utils';
import { IColumn } from './column.types';

/**
 * The unique **Id** of the board.
 */
export type BoardId = ReturnType<typeof genId>;

/**
 * An abstraction of the object having **boardId** property (request message and
 * {@link Board} class)
 */
export interface IBoardId {
  boardId: BoardId;
}

/**
 * An abstraction of the **Board** object.
 */
export interface IBoard {
  title: string;
  columns: IColumn[];
}

/**
 * Defines extra methods provide by the {@link BoardService} object (apart from
 * the regular HTTP request handlers).
 */
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
