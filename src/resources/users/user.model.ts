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
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  userId: UserId = genId(); // TODO: preferably should be private

  name = '';

  login?: string | undefined;

  password?: string | undefined;

  constructor(user: IUser) {
    Object.assign(
      this,
      pick(user, Object.keys(User.schema.request.properties))
    );
  }

  get id() {
    return this.userId;
  }

  assignId(userId: UserId) {
    Object.assign(this, { userId });
    return this;
  }

  toJSON() {
    return pick(this, Object.keys(User.schema.response.properties));
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
