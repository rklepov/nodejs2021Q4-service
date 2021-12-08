// task.router.js

const HTTP_STATUS = require('http-status');

const Task = require('./task.model');
const TaskService = require('./task.service');

const Board = require('../boards/board.model');

class TaskRouter {
  constructor(fastify, db) {
    this.fastify = fastify;
    this.service = new TaskService(db.tasks);

    this.fastify.get('/boards/:boardId/tasks', {
      handler: this.service.getAll.bind(this.service),
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
      handler: this.service.getTask.bind(this.service),
      schema: {
        params: Task.schema.params,
        response: {
          [HTTP_STATUS.OK]: Task.schema.response,
        },
      },
    });

    this.fastify.post('/boards/:boardId/tasks', {
      handler: this.service.addTask.bind(this.service),
      schema: {
        params: Board.schema.params,
        body: Task.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: Task.schema.response,
        },
      },
    });

    this.fastify.put('/boards/:boardId/tasks/:taskId', {
      handler: this.service.updateTask.bind(this.service),
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
      handler: this.service.deleteTask.bind(this.service),
      schema: { params: Task.schema.params },
    });
  }
}

module.exports = TaskRouter;

// __EOF__
