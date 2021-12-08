// user.memory.repository.js

class UserRepo {
  constructor(users) {
    this.users = users;
  }

  async create(user) {
    const id = await this.users.create(user);

    return { id, ...user };
  }

  async read(id) {
    const { hasValue: hasUser, value: user } = await this.users.read(id);
    return { hasUser, user: { id, ...user } };
  }

  async update(id, newUser) {
    const { updated, value: user } = await this.users.update(id, newUser);
    return { updated, user: { id, ...user } };
  }

  async delete(id) {
    const { deleted } = await this.users.delete(id);
    return deleted;
  }

  ls() {
    return this.users.ls();
  }
}

module.exports = UserRepo;

// __EOF__
