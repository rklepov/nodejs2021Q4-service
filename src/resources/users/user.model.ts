// user.model.ts

import pick from 'lodash.pick';

import { genId } from '../../common/utils';
import { IUserId, IUser, UserId } from './user.types';

/**
 * Models the User object which holds the unique **Id** along with the fields
 * describing a user.
 */
class User implements IUserId, IUser {
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  /**
   * The unique user **Id**.
   */
  userId: UserId = genId(); // TODO: preferably should be private

  /**
   * User name.
   */
  name = '';

  /**
   * User login.
   */
  login?: string | undefined;

  /**
   * User password.
   */
  password?: string | undefined;

  /**
   * The {@link User} object constructor.
   *
   * @param user - An object with the fields matching {@link User.schema}.
   */
  constructor(user: IUser) {
    Object.assign(
      this,
      pick(user, Object.keys(User.schema.request.properties))
    );
  }

  /**
   * Returns the object **Id**.
   */
  get id() {
    return this.userId;
  }

  /**
   * Assigns **Id** to the user.
   *
   * @param userId - The **Id** of the user.
   * @returns `this` {@link User} object.
   *
   * @deprecated The **Id** is now stored in {@link User} object itself.
   */
  assignId(userId: UserId) {
    Object.assign(this, { userId });
    return this;
  }

  /**
   * Returns DTO equivalent of the **User** object (the `password` property is
   * omitted). Eventually used as the JSON body of HTTP response.
   *
   * @returns The DTO equivalent of the **User** object.
   */
  toJSON() {
    return pick(this, Object.keys(User.schema.response.properties));
  }

  /**
   * The JSON schema for the user object validation.
   *
   * @privateremarks
   * TODO: learn more about how to automatically generate this from OpenAPI spec
   */
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
