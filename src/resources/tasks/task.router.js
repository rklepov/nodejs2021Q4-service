// task.router.js

import HTTP_STATUS from 'http-status';

import { defineHandler } from '../../common/handler.js';

import Task from './task.model.js';
import TaskService from './task.service.js';

import Board from '../boards/board.model.js';
import BoardService from '../boards/board.service.js';

class TaskRouter {
  constructor(fastify, db) {
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
        schema: {
          params: Task.schema.params,
        },
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
