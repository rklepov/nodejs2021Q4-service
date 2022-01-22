// user.model.ts

import pick from 'lodash.pick';

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { IUser, UserId } from './user.types';

/**
 * Models the User object which holds the unique **Id** along with the fields
 * describing a user.
 */
@Entity()
class User implements IUser {
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  /**
   * The unique user **Id**.
   */
  @PrimaryGeneratedColumn('uuid')
  userId?: UserId;

  /**
   * User name.
   */
  @Column('varchar')
  name = '';

  /**
   * User login.
   */
  @Column('varchar')
  login?: string | undefined;

  /**
   * User password.
   */
  @Column('varchar')
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

export default User;

// __EOF__
