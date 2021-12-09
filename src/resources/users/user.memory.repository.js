// user.memory.repository.js

class UserRepo {
  constructor(users) {
    this.users = users;
  }

  async create(user) {
    const { key: userId } = await this.users.create(user);
    return user.assignId(userId);
  }

  async read(userId) {
    const { hasValue: found, value: user } = await this.users.read(userId);
    return found ? user.assignId(userId) : null;
  }

  async update(userId, user) {
    const { updated: found, value: updatedUser } = await this.users.update(
      userId,
      user
    );
    return found ? updatedUser.assignId(userId) : null;
  }

  async delete(userId) {
    const { deleted } = await this.users.delete(userId);
    return deleted;
  }

  async ls() {
    const users = await this.users.ls();
    return users.map(({key: userId, value: user}) => user.assignId(userId))
  }
}

export default UserRepo;

// __EOF__
