// user.service.ts

import HTTP_STATUS from 'http-status';

import Logger from '../../common/logger';
import { hashPassword, reply } from '../../common/utils';

import { DatabaseConnection } from '../../db/database';

import {
  UserGetRequest,
  UserPostRequest,
  UserPutRequest,
  UserDeleteRequest,
} from './user.types';

import User from './user.model';
import UserRepo from './user.repo';

/**
 * HTTP request handlers for {@link User}.
 */
class UserService {
  /**
   * Logger instance.
   */
  log: Logger;

  /**
   * Users repository: an interface to the database table.
   */
  repo: UserRepo;

  /**
   * The constructor of the {@link UserService} instance.
   *
   * @param log - {@link Logger} instance.
   * @param db - An instance of Typeorm database connection.
   * operations on the {@link Task} object linked to the {@link User} object.
   */
  constructor(log: Logger, db: DatabaseConnection) {
    this.log = log;
    this.repo = new UserRepo(db);
  }

  /**
   * GET (all) request handler. List all stored users.
   *
   * @returns An array of the currently stored users along with the
   * `HTTP.OK(200)` status code
   *
   * @remarks
   * async, returns a Promise
   */
  async getAll() {
    const users = await this.repo.ls();
    this.log.debug(`Returning ${users.length} user(s)`);
    return reply(HTTP_STATUS.OK, users);
  }

  /**
   * GET request handler. Get the user by **Id**.
   *
   * @param __namedParameters - HTTP request parameters holding the requested
   * user **Id**.
   *
   * @param params - HTTP request parameters holding the requested user **Id**.
   *
   * @returns The user object and `HTTP.OK(200)` status, or
   * `HTTP.NOT_FOUND(404)` if the user with the provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async get({ params }: UserGetRequest) {
    const { userId } = params;
    const user = await this.repo.read(userId);

    if (user) {
      return reply(HTTP_STATUS.OK, user);
    }
    this.log.warn(`[UserService::get] User with Id '${userId}' not found`);
    return reply(HTTP_STATUS.NOT_FOUND, { userId });
  }

  /**
   * POST request handler. Add a new user.
   *
   * @param __namedParameters - HTTP request body holding the added user fields.
   *
   * @param body - HTTP request body holding the added user fields.
   *
   * @returns The newly created user object with assigned **Id** and
   * `HTTP.OK(200)` status, or `HTTP.NOT_FOUND(404)` if the user with the
   * provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async add({ body }: UserPostRequest) {
    const user = new User(body);

    // ! pass the specific user nto model 500 internal server error
    if (user.name === 'Harry Potter') {
      throw new ReferenceError('Expelliarmus!');
    }

    user.password = await hashPassword(user.password || '');

    return reply(HTTP_STATUS.CREATED, await this.repo.create(user));
  }

  /**
   * PUT request handler. Update the user by **Id**.
   *
   * @param __namedParameters - HTTP request parameters holding the updated user
   * **Id** and HTTP request body with the user fields validated by the schema.
   *
   * @param params - HTTP request parameters holding the updated user **Id**.
   * @param body - HTTP request body with the user fields validated by the
   * schema.
   *
   * @returns The updated user object and `HTTP.OK(200)` status, or
   * `HTTP.NOT_FOUND(404)` if the user with the provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async update({ params, body }: UserPutRequest) {
    const { userId } = params;
    const user = await this.repo.update(userId, new User(body));

    if (user) {
      return reply(HTTP_STATUS.OK, user);
    }
    this.log.warn(`[UserService::update] User with Id '${userId}' not found`);
    return reply(HTTP_STATUS.NOT_FOUND, { userId });
  }

  /**
   * DELETE request handler. Delete the user by **Id**.
   *
   * @param __namedParameters - HTTP request parameters holding the deleted user
   * **Id**.
   *
   * @param params - HTTP request parameters holding the deleted user **Id**.
   *
   * @returns The user object and `HTTP_STATUS.NO_CONTENT(204)` status, or
   * `HTTP.NOT_FOUND(404)` if the user with the provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async delete({ params }: UserDeleteRequest) {
    const { userId } = params;

    if (await this.repo.delete(userId)) {
      return reply(HTTP_STATUS.NO_CONTENT);
    }
    this.log.warn(`[UserService::delete] User with Id '${userId}' not found`);
    return reply(HTTP_STATUS.NOT_FOUND, { userId });
  }
}

export default UserService;

// __EOF__
