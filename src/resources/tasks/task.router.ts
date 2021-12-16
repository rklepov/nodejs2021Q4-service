// task.router.ts

import HTTP_STATUS from 'http-status';

import fastify from 'fastify';

import { defineHandler } from '../../common/handler';

import { Database } from '../../db/database';

import Task from './task.model';
import TaskService from './task.service';

import Board from '../boards/board.model';
import BoardService from '../boards/board.service';

type Server = ReturnType<typeof fastify>;

class TaskRouter {
  fastify: Server;

  service: TaskService;

  constructor(server: Server, db: Database) {
    this.fastify = server;
    this.service = new TaskService(db.tasks, new BoardService(db.boards));

    this.fastify.get('/boards/:boardId/tasks', {
      handler: defineHandler(this, 'getAll'),
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

    this.fastify.get('/boards/:boardId/tasks/:taskId', {
      handler: defineHandler(this, 'getTask'),
      schema: {
        tags: Task.schema.tags,
        params: Task.schema.params,
        response: {
          [HTTP_STATUS.OK]: Task.schema.response,
        },
      },
    });

    this.fastify.post('/boards/:boardId/tasks', {
      handler: defineHandler(this, 'addTask'),
      schema: {
        tags: Task.schema.tags,
        params: Board.schema.params,
        body: Task.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: Task.schema.response,
        },
      },
    });

    this.fastify.put('/boards/:boardId/tasks/:taskId', {
      handler: defineHandler(this, 'updateTask'),
      schema: {
        tags: Task.schema.tags,
        params: Task.schema.params,
        body: Task.schema.request,
        response: {
          [HTTP_STATUS.OK]: Task.schema.response,
        },
      },
    });

    this.fastify.delete('/boards/:boardId/tasks/:taskId', {
      handler: defineHandler(this, 'deleteTask'),
      schema: { tags: Task.schema.tags, params: Task.schema.params },
    });
  }
}

export default TaskRouter;

// __EOF__
