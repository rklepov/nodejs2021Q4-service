// task.router.ts

import HTTP_STATUS from 'http-status';

import fastify from 'fastify';

// import { defineHandler } from '../../common/handler';

import { Database } from '../../db/database';

import Task, { ITask, ITaskId } from './task.model';
import TaskService from './task.service';

import Board, { IBoardId } from '../boards/board.model';
import BoardService from '../boards/board.service';

type Server = ReturnType<typeof fastify>;

class TaskRouter {
  fastify: Server;

  service: TaskService;

  constructor(server: Server, db: Database) {
    this.fastify = server;
    this.service = new TaskService(db.tasks, new BoardService(db.boards));

    this.fastify.get<{ Params: IBoardId }>('/boards/:boardId/tasks', {
      // handler: defineHandler(this, 'getAll'),
      handler: async (_, p) => {
        const { status, payload } = await this.service.getAll();
        await p.code(status).send(payload);
      },
      schema: {
        tags: Task.schema.tags,
        params: Board.schema.params,
        response: {
          [HTTP_STATUS.OK]: {
            type: 'array',
            items: Task.schema.response,
          },
        },
      },
    });

    this.fastify.get<{ Params: IBoardId & ITaskId }>(
      '/boards/:boardId/tasks/:taskId',
      {
        // handler: defineHandler(this, 'get'),
        handler: async (q, p) => {
          const { status, payload } = await this.service.get(q);
          await p.code(status).send(payload);
        },
        schema: {
          tags: Task.schema.tags,
          params: Task.schema.params,
          response: {
            [HTTP_STATUS.OK]: Task.schema.response,
          },
        },
      }
    );

    this.fastify.post<{ Params: IBoardId; Body: ITask }>(
      '/boards/:boardId/tasks',
      {
        // handler: defineHandler(this, 'add'),
        handler: async (q, p) => {
          const { status, payload } = await this.service.add(q);
          await p.code(status).send(payload);
        },
        schema: {
          tags: Task.schema.tags,
          params: Board.schema.params,
          body: Task.schema.request,
          response: {
            [HTTP_STATUS.CREATED]: Task.schema.response,
          },
        },
      }
    );

    this.fastify.put<{ Params: IBoardId & ITaskId; Body: ITask }>(
      '/boards/:boardId/tasks/:taskId',
      {
        // handler: defineHandler(this, 'update'),
        handler: async (q, p) => {
          const { status, payload } = await this.service.update(q);
          await p.code(status).send(payload);
        },
        schema: {
          tags: Task.schema.tags,
          params: Task.schema.params,
          body: Task.schema.request,
          response: {
            [HTTP_STATUS.OK]: Task.schema.response,
          },
        },
      }
    );

    this.fastify.delete<{ Params: IBoardId & ITaskId }>(
      '/boards/:boardId/tasks/:taskId',
      {
        // handler: defineHandler(this, 'delete'),
        handler: async (q, p) => {
          const { status, payload } = await this.service.delete(q);
          await p.code(status).send(payload);
        },
        schema: { tags: Task.schema.tags, params: Task.schema.params },
      }
    );
  }
}

export default TaskRouter;

// __EOF__
