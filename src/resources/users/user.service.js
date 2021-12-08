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
    const { hasUser, user } = await this.repo.read(userId);

    if (hasUser) {
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
    const newUser = new User(q.body);
    const { updated, user } = await this.repo.update(userId, newUser);

    if (updated) {
      p.send(user);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ userId });
    }
  }

  async deleteUser(q, p) {
    const { userId: id } = q.params;

    if (await this.repo.delete(id)) {
      await this.taskService.unassignUser(id);
      p.code(HTTP_STATUS.NO_CONTENT).send();
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ id });
    }
  }
}

module.exports = UserService;

// __EOF__
