// user.service.js

const HTTP_STATUS = require('http-status');

const User = require('./user.model');
const UserRepo = require('./user.memory.repository');

class UserService {
  constructor(users, taskService) {
    this.repo = new UserRepo(users);
    this.taskService = taskService;
  }

  async getAll(q, p) {
    p.send(await this.repo.ls());
  }

  async getUser(q, p) {
    const { userId } = q.params;
    const user = await this.repo.read(userId);

    if (user) {
      p.send(user);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ userId });
    }
  }

  async addUser(q, p) {
    const user = new User(q.body);
    p.code(HTTP_STATUS.CREATED).send(await this.repo.create(user));
  }

  async updateUser(q, p) {
    const { userId } = q.params;
    let user = new User(q.body);
    user = await this.repo.update(userId, user);

    if (user) {
      p.send(user);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ userId });
    }
  }

  async deleteUser(q, p) {
    const { userId } = q.params;

    if (await this.repo.delete(userId)) {
      await this.taskService.unassignUser(userId);
      p.code(HTTP_STATUS.NO_CONTENT).send();
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ userId });
    }
  }
}

module.exports = UserService;

// __EOF__
