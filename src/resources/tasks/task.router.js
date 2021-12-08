// task.router.js

const HTTP_STATUS = require('http-status');

const { defineHandler } = require('../../common/handler');

const Task = require('./task.model');
const TaskService = require('./task.service');

const Board = require('../boards/board.model');
const BoardService = require('../boards/board.service');

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

module.exports = TaskRouter;

// __EOF__
