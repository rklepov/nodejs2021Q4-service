// user.memory.repository.js

class UserRepo {
  constructor(db) {
    this.db = db;
  }

  async create(user) {
    const id = await this.db.users.create(user);

    return { id, ...user };
  }

  async read(id) {
    const { hasValue: hasUser, value: user } = await this.db.users.read(id);
    return { hasUser, user: { id, ...user } };
  }

  async update(id, newUser) {
    const { updated, value: user } = await this.db.users.update(id, newUser);
    return { updated, user };
  }

  async delete(id) {
    const { deleted } = await this.db.users.delete(id);
    return deleted;
  }

  ls() {
    return this.db.users.ls();
  }
}

module.exports = UserRepo;

// __EOF__
