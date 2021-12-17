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

class UserService {
  repo: UserRepo;

  taskService: ITaskService;

  constructor(users: UsersTable, taskService: ITaskService) {
    this.repo = new UserRepo(users);
    this.taskService = taskService;
  }

  async getAll() {
    return reply(HTTP_STATUS.OK, await this.repo.ls());
  }

  async get({ params }: UserGetRequest) {
    const { userId } = params;
    const user = await this.repo.read(userId);

    if (user) {
      return reply(HTTP_STATUS.OK, user);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { userId });
  }

  async add({ body }: UserPostRequest) {
    const user = new User(body);
    return reply(HTTP_STATUS.CREATED, await this.repo.create(user));
  }

  async update({ params, body }: UserPutRequest) {
    const { userId } = params;
    const user = await this.repo.update(userId, new User(body));

    if (user) {
      return reply(HTTP_STATUS.OK, user);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { userId });
  }

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
