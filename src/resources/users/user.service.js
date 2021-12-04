// user.service.js

class UserService {
  constructor(repo) {
    this.repo = repo;
  }

  async getAll(q, p) {
    p.send(await this.repo.ls());
  }

  async getUser(q, p) {
    const { id } = q.params;
    const { hasValue, value: user } = await this.repo.read(id);

    if (hasValue) {
      p.send({ id, ...user });
    } else {
      p.code(404).send();
    }
  }

  async addUser(q, p) {
    const user = q.body;
    const id = await this.repo.create(user);

    p.code(201).send({ id, ...user });
  }

  async updateUser(q, p) {
    const { id } = q.params;
    const newUser = q.body;
    const { updated, value: user } = await this.repo.update(id, newUser);

    if (updated) {
      p.send({ id, ...user });
    } else {
      // TODO: send user id in the message
      p.code(404).send();
    }
  }

  async deleteUser(q, p) {
    const { id } = q.params;
    const { deleted } = await this.repo.delete(id);

    if (deleted) {
      p.code(204).send();
    } else {
      // TODO: send user id in the message
      p.code(404).send();
    }
  }
}

module.exports = UserService;

// __EOF__
