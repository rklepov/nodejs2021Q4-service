// task.router.ts

import HTTP_STATUS from 'http-status';

import http from 'http';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';

import { defineHandler } from '../../common/handler';

import { Database } from '../../db/database';

import Task from './task.model';
import TaskService from './task.service';

import Board from '../boards/board.model';
import BoardService from '../boards/board.service';

// TODO: this should be inherited from the common declaration
type Server = FastifyInstance<
  http.Server,
  http.IncomingMessage,
  http.ServerResponse,
  FastifyLoggerInstance
>;

class TaskRouter {
  fastify: Server;

  service: TaskService;

  constructor(fastify: Server, db: Database) {
    this.fastify = fastify;
    this.service = new TaskService(db.tasks, new BoardService(db.boards));

    this.fastify.get('/boards/:boardId/tasks', {
      handler: defineHandler(this, 'getAll'),
      schema: {
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
        params: Task.schema.params,
        response: {
          [HTTP_STATUS.OK]: Task.schema.response,
        },
      },
    });

    this.fastify.post('/boards/:boardId/tasks', {
      handler: defineHandler(this, 'addTask'),
      schema: {
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
        params: Task.schema.params,
        body: Task.schema.request,
        response: {
          [HTTP_STATUS.OK]: Task.schema.response,
        },
      },
    });

    this.fastify.delete('/boards/:boardId/tasks/:taskId', {
      handler: defineHandler(this, 'deleteTask'),
      schema: { params: Task.schema.params },
    });
  }
}

export default TaskRouter;

// __EOF__
