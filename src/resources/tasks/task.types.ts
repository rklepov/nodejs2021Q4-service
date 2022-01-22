// task.types.ts

import { FastifyRequest } from 'fastify';

import { UUIDString } from '../../common/utils';

import { UserId } from '../users/user.types';
import { IBoardId } from '../boards/board.types';
import { BoardColumnId } from '../boards/board-column.types';

/**
 * The unique **Id** of the task.
 */
export type TaskId = UUIDString;

/**
 * An abstraction of the object having **taskId** property (request message and
 * {@link Task} class)
 */
export interface ITaskId {
  taskId: TaskId;
}

/**
 * An abstraction of the **Task** object.
 */
export interface ITask {
  title: string;
  order: number;
  description?: string;
  userId?: UserId | null;
  columnId?: BoardColumnId | null;
}

export type TaskGetAllRequest = FastifyRequest<{ Params: IBoardId }>;
export type TaskGetRequest = FastifyRequest<{ Params: IBoardId & ITaskId }>;
export type TaskPostRequest = FastifyRequest<{ Params: IBoardId; Body: ITask }>;
export type TaskPutRequest = FastifyRequest<{
  Params: IBoardId & ITaskId;
  Body: ITask;
}>;
export type TaskDeleteRequest = FastifyRequest<{ Params: IBoardId & ITaskId }>;

// __EOF__
