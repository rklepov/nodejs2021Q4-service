// user.router.js

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
          200: {
            type: 'array',
            items: User.schema.response,
          },
        },
      },
    });

    this.fastify.get('/users/:id', {
      handler: this.service.getUser.bind(this.service),
      schema: {
        response: {
          200: User.schema.response,
        },
      },
    });

    this.fastify.post('/users', {
      handler: this.service.addUser.bind(this.service),
      schema: {
        body: User.schema.request,
        response: {
          201: User.schema.response,
        },
      },
    });

    this.fastify.put('/users/:id', {
      handler: this.service.updateUser.bind(this.service),
      schema: {
        body: User.schema.request,
        response: {
          200: User.schema.response,
        },
      },
    });

    this.fastify.delete('/users/:id', {
      handler: this.service.deleteUser.bind(this.service),
    });
  }
}

module.exports = UserRouter;

// __EOF__
