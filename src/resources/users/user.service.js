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
    const { hasUser, user } = await this.repo.read(id);

    if (hasUser) {
      p.send(user);
    } else {
      p.code(404).send({ id });
    }
  }

  async addUser(q, p) {
    const user = q.body;
    p.code(201).send(await this.repo.create(user));
  }

  async updateUser(q, p) {
    const { id } = q.params;
    const newUser = q.body;
    const { updated, user } = await this.repo.update(id, newUser);

    if (updated) {
      p.send(user);
    } else {
      p.code(404).send({ id });
    }
  }

  async deleteUser(q, p) {
    const { id } = q.params;

    if (await this.repo.delete(id)) {
      p.code(204).send();
    } else {
      p.code(404).send({ id });
    }
  }
}

module.exports = UserService;

// __EOF__
