// user.service.ts

import HTTP_STATUS from 'http-status';

import { reply } from '../../common/utils';

import { UsersTable } from '../../db/database';

import { ITaskService } from '../tasks/task.types';

import {
  UserGetRequest,
  UserPostRequest,
  UserPutRequest,
  UserDeleteRequest,
} from './user.types';

import User from './user.model';
import UserRepo from './user.memory.repository';

/**
 * HTTP request handlers for {@link User}.
 *
 * TODO: some return types of the methods below are not inferred by TS
 * correctly, need to understand the reason of that and maybe specify the types
 * explicitly
 */
class UserService {
  /**
   * Users repository: an interface to the database table.
   */
  repo: UserRepo;

  /**
   * Task service. Allows operations on the {@link Task} objects which are
   * linked to the {@link User}.
   */
  taskService: ITaskService;

  /**
   * The constructor of the {@link UserService} instance.
   *
   * @param users - An instance of the Users table.
   * @param taskService - The instance of {@link TaskService} that allows
   * operations on the Task object linked to the User object.
   */
  constructor(users: UsersTable, taskService: ITaskService) {
    this.repo = new UserRepo(users);
    this.taskService = taskService;
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
    return reply(HTTP_STATUS.OK, await this.repo.ls());
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
      await this.taskService.unassignUser(userId);
      return reply(HTTP_STATUS.NO_CONTENT);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { userId });
  }
}

export default UserService;

// __EOF__
