// user.memory.repository.ts

import { UsersTable } from '../../db/database';

import User from './user.model';
import { UserId } from './user.types';

/**
 * The user repository class: an abstraction layer over the database table.
 */
class UserRepo {
  users: UsersTable;

  /**
   * The constructor takes аn instance of the Users table and saves it in the
   * object property.
   *
   * @param users - An instance of the Users table.
   */
  constructor(users: UsersTable) {
    this.users = users;
  }

  /**
   * Adds new user to the database table.
   *
   * @param user - An instance of the {@link User} object to save in the
   * database table
   *
   * @returns The same user object passed to the function.
   *
   * @remarks
   * async, returns a Promise
   *
   * @privateRemarks
   * TODO: the object now stores the Id itself, no need to explicity assign it.
   */
  async create(user: User) {
    const { key: userId } = await this.users.create(user.id, user);
    return user.assignId(userId);
  }

  /**
   * Get the user by **Id**.
   *
   * @param userId - The **Id** of the {@link User} object to return.
   *
   * @returns The {@link User} object or `null` if the user with the provided
   * **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async read(userId: UserId) {
    const { hasValue: found, value: user } = await this.users.read(userId);
    // TODO: ?. is not needed here, the contract is that if found: true then the
    // user is guaranteed to be present.  Any way to describe this in TS?
    return found ? user?.assignId(userId) || null : null;
  }

  /**
   * Update the user with the specified **Id**.
   *
   * @param userId - The **Id** of the {@link User} object to update.
   * @param user - The new instance of the {@link User} object.
   *
   * @returns The updated {@link User} object or `null` if the user with the
   * provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async update(userId: UserId, user: User) {
    const { updated: found, value: updatedUser } = await this.users.update(
      userId,
      user
    );
    // TODO: same as in read() above
    return found ? updatedUser?.assignId(userId) || null : null;
  }

  /**
   * Delete the user with the specified **Id**.
   *
   * @param userId - The **Id** of the {@link User} object to delete.
   *
   * @returns `true` if the {@link User} object  with the specified **Id** was
   * found and deleted, `false` otherwise.
   *
   * @remarks
   * async, returns a Promise
   */
  async delete(userId: UserId) {
    const { deleted } = await this.users.delete(userId);
    return deleted;
  }

  /**
   * List all users in the database table.
   *
   * @returns An array of {@link User} objects stored in the table.
   *
   * @remarks
   * async, returns a Promise
   */
  async ls() {
    const users = await this.users.ls();
    return users.map(({ key: userId, value: user }) => user.assignId(userId));
  }
}

export default UserRepo;

// __EOF__
