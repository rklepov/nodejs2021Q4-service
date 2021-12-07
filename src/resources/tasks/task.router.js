// task.router.js

const TaskRepo = require('./task.memory.repository');
const TaskService = require('./task.service');
const Task = require('./task.model');
const Board = require('../boards/board.model');

class TaskRouter {
  constructor(fastify, db) {
    this.fastify = fastify;
    this.service = new TaskService(new TaskRepo(db));

    this.fastify.get('/boards/:boardId/tasks', {
      handler: this.service.getAll.bind(this.service),
      schema: {
        params: Board.schema.params,
        response: {
          200: {
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
          200: Task.schema.response,
        },
      },
    });

    this.fastify.post('/boards/:boardId/tasks', {
      handler: this.service.addTask.bind(this.service),
      schema: {
        params: Board.schema.params,
        body: Task.schema.request,
        response: {
          201: Task.schema.response,
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
          200: Task.schema.response,
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
