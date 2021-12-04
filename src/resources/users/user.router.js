// user.router.js

const UserService = require('./user.service');
const UserRepo = require('./user.memory.repository');

const UserSchema = {
  request: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
      login: { type: 'string' },
      password: { type: 'string' },
    },
  },

  response: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      login: {
        type: 'string',
      },
    },
  },
};

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
            items: UserSchema.response,
          },
        },
      },
    });

    this.fastify.get('/users/:id', {
      handler: this.service.getUser.bind(this.service),
      schema: {
        response: {
          200: UserSchema.response,
        },
      },
    });

    this.fastify.post('/users', {
      handler: this.service.addUser.bind(this.service),
      schema: {
        body: UserSchema.request,
        response: {
          201: UserSchema.response,
        },
      },
    });

    this.fastify.put('/users/:id', {
      handler: this.service.updateUser.bind(this.service),
      schema: {
        body: UserSchema.request,
        response: {
          200: UserSchema.response,
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
