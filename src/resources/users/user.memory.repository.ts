// user.memory.repository.ts

import { UsersTable } from '../../db/database';

import User from './user.model';
import { UserId } from './user.types';

class UserRepo {
  users: UsersTable;

  constructor(users: UsersTable) {
    this.users = users;
  }

  async create(user: User) {
    const { key: userId } = await this.users.create(user.id, user);
    return user.assignId(userId);
  }

  async read(userId: UserId) {
    const { hasValue: found, value: user } = await this.users.read(userId);
    // TODO: ?. is not needed here, the contract is that if found: true
    //       then the user is guaranteed to be present.
    //       Any way to describe this in TS?
    return found ? user?.assignId(userId) || null : null;
  }

  async update(userId: UserId, user: User) {
    const { updated: found, value: updatedUser } = await this.users.update(
      userId,
      user
    );
    // TODO: same as in read() above
    return found ? updatedUser?.assignId(userId) || null : null;
  }

  async delete(userId: UserId) {
    const { deleted } = await this.users.delete(userId);
    return deleted;
  }

  async ls() {
    const users = await this.users.ls();
    return users.map(({ key: userId, value: user }) => user.assignId(userId));
  }
}

export default UserRepo;

// __EOF__
