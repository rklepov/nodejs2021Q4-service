// user.model.js

// TODO: learn more about how to automatically generate this from OpenAPI spec
const User = {
  schema: {
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
  },
};

module.exports = User;

// __EOF__
