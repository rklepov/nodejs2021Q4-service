// task.types.ts

import { FastifyRequest } from 'fastify';

import { genId } from '../../common/utils';

import { UserId } from '../users/user.types';
import { BoardId, IBoardId } from '../boards/board.types';
import { ColumnId } from '../boards/column.types';

export type TaskId = ReturnType<typeof genId>;

export interface ITaskId {
  taskId: TaskId;
}

export interface ITask {
  title: string;
  order: number;
  description?: string;
  columnId?: ColumnId | null;
}

export interface ITaskService {
  unassignUser(userId: UserId): Promise<void>;
  deleteTasksFor(boardId: BoardId): Promise<void>;
}

export type TaskGetRequest = FastifyRequest<{ Params: IBoardId & ITaskId }>;
export type TaskPostRequest = FastifyRequest<{ Params: IBoardId; Body: ITask }>;
export type TaskPutRequest = FastifyRequest<{
  Params: IBoardId & ITaskId;
  Body: ITask;
}>;
export type TaskDeleteRequest = FastifyRequest<{ Params: IBoardId & ITaskId }>;

// __EOF__
