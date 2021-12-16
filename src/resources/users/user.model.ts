// user.model.ts

import pick from 'lodash.pick';

import { UserId } from '../../db/database';

interface IUserId {
  userId: UserId;
}

interface IUser {
  name: string;
  login?: string;
  password?: string;
}

class User implements IUserId, IUser {
  // TODO: wonder if the class fields can be somehow inferred from the JSON schema below?
  userId: UserId = ''; // TODO: the id shouldn't be an empty string

  name = '';

  login?: string | undefined;

  password?: string | undefined;

  constructor(user: IUser) {
    Object.assign(
      this,
      pick(user, Object.keys(User.schema.request.properties))
    );
  }

  assignId(userId: UserId) {
    Object.assign(this, { userId });
    return this;
  }

  toJSON() {
    const { userId: id, ...rest } = this;
    return pick({ id, ...rest }, Object.keys(User.schema.response.properties));
  }

  // TODO: learn more about how to automatically generate this from OpenAPI spec
  static schema = {
    tags: ['user'],

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

export { UserId, IUserId, IUser };
export default User;

// __EOF__
