// user.router.js

const HTTP_STATUS = require('http-status');

const UserRepo = require('./user.memory.repository');
const UserService = require('./user.service');
const User = require('./user.model');

class UserRouter {
  constructor(fastify, db) {
    this.fastify = fastify;
    this.service = new UserService(new UserRepo(db));

    this.fastify.get('/users', {
      handler: this.service.getAll.bind(this.service),
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
      handler: this.service.getUser.bind(this.service),
      schema: {
        params: User.schema.params,
        response: {
          [HTTP_STATUS.OK]: User.schema.response,
        },
      },
    });

    this.fastify.post('/users', {
      handler: this.service.addUser.bind(this.service),
      schema: {
        body: User.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: User.schema.response,
        },
      },
    });

    this.fastify.put('/users/:userId', {
      handler: this.service.updateUser.bind(this.service),
      schema: {
        params: User.schema.params,
        body: User.schema.request,
        response: {
          [HTTP_STATUS.OK]: User.schema.response,
        },
      },
    });

    this.fastify.delete('/users/:userId', {
      handler: this.service.deleteUser.bind(this.service),
      schema: { params: User.schema.params },
    });
  }
}

module.exports = UserRouter;

// __EOF__
