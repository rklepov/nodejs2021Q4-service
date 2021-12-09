// user.model.js

import pick from 'lodash.pick';

class User {
  constructor(user) {
    Object.assign(
      this,
      pick(user, Object.keys(User.schema.request.properties))
    );
  }

  assignId(userId) {
    Object.assign(this, { id: userId });
    return this;
  }

  toJSON() {
    return pick(this, Object.keys(User.schema.response.properties));
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

export default User;

// __EOF__
