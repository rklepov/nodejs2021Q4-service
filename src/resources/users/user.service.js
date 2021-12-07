// user.service.js

const HTTP_STATUS = require('http-status');

class UserService {
  constructor(repo) {
    this.repo = repo;
  }

  async getAll(q, p) {
    p.send(await this.repo.ls());
  }

  async getUser(q, p) {
    const { userId: id } = q.params;
    const { hasUser, user } = await this.repo.read(id);

    if (hasUser) {
      p.send(user);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ id });
    }
  }

  async addUser(q, p) {
    const user = q.body;
    p.code(HTTP_STATUS.CREATED).send(await this.repo.create(user));
  }

  async updateUser(q, p) {
    const { userId: id } = q.params;
    const newUser = q.body;
    const { updated, user } = await this.repo.update(id, newUser);

    if (updated) {
      p.send(user);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ id });
    }
  }

  async deleteUser(q, p) {
    const { userId: id } = q.params;

    if (await this.repo.delete(id)) {
      p.code(HTTP_STATUS.NO_CONTENT).send();
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ id });
    }
  }
}

module.exports = UserService;

// __EOF__
