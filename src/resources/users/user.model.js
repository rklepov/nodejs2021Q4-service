// user.model.js

const pick = require('lodash.pick');
const difference = require('lodash.difference');

class User {
  constructor(user) {
    Object.assign(
      this,
      pick(user, Object.keys(User.schema.request.properties))
    );
  }

  toJSON() {
    return pick(this, difference(Object.keys(this), ['password']));
  }

  // TODO: learn more about how to automatically generate this from OpenAPI spec
  static schema = {
    params: {
      type: 'object',
      additionalProperties: false,
      required: ['userId'],
      properties: {
        userId: { type: 'string', format: 'uuid' },
      },
    },

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
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        login: { type: 'string' },
      },
    },
  };
}

module.exports = User;

// __EOF__
