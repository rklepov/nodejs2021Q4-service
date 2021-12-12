// user.service.ts

import HTTP_STATUS from 'http-status';

import { reply } from '../../common/reply';

import { UsersTable } from '../../db/database';

import TaskService from '../tasks/task.service';

import User from './user.model';
import UserRepo from './user.memory.repository';

class UserService {
  repo: UserRepo;

  taskService: TaskService;

  constructor(users: UsersTable, taskService: TaskService) {
    this.repo = new UserRepo(users);
    this.taskService = taskService;
  }

  async getAll() {
    return reply(HTTP_STATUS.OK, await this.repo.ls());
  }

  async getUser({ params }) {
    const { userId } = params;
    const user = await this.repo.read(userId);

    if (user) {
      return reply(HTTP_STATUS.OK, user);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { userId });
  }

  async addUser({ body }) {
    const user = new User(body);
    return reply(HTTP_STATUS.CREATED, await this.repo.create(user));
  }

  async updateUser({ params, body }) {
    const { userId } = params;
    const user = await this.repo.update(userId, new User(body));

    if (user) {
      return reply(HTTP_STATUS.OK, user);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { userId });
  }

  async deleteUser({ params }) {
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
