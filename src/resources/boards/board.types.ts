// board.types.ts

import { FastifyRequest } from 'fastify';

import { UUIDString } from '../../common/utils';

import { IBoardColumn } from './board-column.types';

/**
 * The unique **Id** of the board.
 */
export type BoardId = UUIDString;

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
  columns?: IBoardColumn[];
}

/**
 * Defines extra methods provided by {@link BoardService} class (apart from the
 * regular HTTP request handlers).
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
