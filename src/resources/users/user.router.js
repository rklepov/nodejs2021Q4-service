// user.router.js

const HTTP_STATUS = require('http-status');

const { defineHandler } = require('../../common/handler');

const User = require('./user.model');
const UserService = require('./user.service');

const TaskService = require('../tasks/task.service');

class UserRouter {
  constructor(fastify, db) {
    this.fastify = fastify;
    this.service = new UserService(db.users, new TaskService(db.tasks));

    this.fastify.get('/users', {
      handler: defineHandler(this, 'getAll'),
      schema: {
        response: {
          [HTTP_STATUS.OK]: {
            type: 'array',
            items: User.schema.response,
          },
        },
      },
    });

    this.fastify.get('/users/:userId', {
      handler: defineHandler(this, 'getUser'),
      schema: {
        params: User.schema.params,
        response: {
          [HTTP_STATUS.OK]: User.schema.response,
        },
      },
    });

    this.fastify.post('/users', {
      handler: defineHandler(this, 'addUser'),
      schema: {
        body: User.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: User.schema.response,
        },
      },
    });

    this.fastify.put('/users/:userId', {
      handler: defineHandler(this, 'updateUser'),
      schema: {
        params: User.schema.params,
        body: User.schema.request,
        response: {
          [HTTP_STATUS.OK]: User.schema.response,
        },
      },
    });

    this.fastify.delete('/users/:userId', {
      handler: defineHandler(this, 'deleteUser'),
      schema: { params: User.schema.params },
    });
  }
}

module.exports = UserRouter;

// __EOF__
