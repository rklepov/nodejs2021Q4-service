// user.service.js

const HTTP_STATUS = require('http-status');

const { Reply } = require('../../common/reply');

const User = require('./user.model');
const UserRepo = require('./user.memory.repository');

class UserService {
  constructor(users, taskService) {
    this.repo = new UserRepo(users);
    this.taskService = taskService;
  }

  async getAll() {
    return Reply(HTTP_STATUS.OK, await this.repo.ls());
  }

  async getUser({ params }) {
    const { userId } = params;
    const user = await this.repo.read(userId);

    if (user) {
      return Reply(HTTP_STATUS.OK, user);
    }
    return Reply(HTTP_STATUS.NOT_FOUND, { userId });
  }

  async addUser({ body }) {
    const user = new User(body);
    return Reply(HTTP_STATUS.CREATED, await this.repo.create(user));
  }

  async updateUser({ params, body }) {
    const { userId } = params;
    let user = new User(body);
    user = await this.repo.update(userId, user);

    if (user) {
      return Reply(HTTP_STATUS.OK, user);
    }
    return Reply(HTTP_STATUS.NOT_FOUND, { userId });
  }

  async deleteUser({ params }) {
    const { userId } = params;

    if (await this.repo.delete(userId)) {
      await this.taskService.unassignUser(userId);
      return Reply(HTTP_STATUS.NO_CONTENT);
    }
    return Reply(HTTP_STATUS.NOT_FOUND, { userId });
  }
}

module.exports = UserService;

// __EOF__
