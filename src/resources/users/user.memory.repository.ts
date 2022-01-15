// user.memory.repository.ts

import { DatabaseConnection, UsersTable } from '../../db/database';

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
   * @param db - An instance of Typeorm database connection.
   */
  constructor(db: DatabaseConnection) {
    this.users = db.getRepository(User);
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
    return this.users.save(user);
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
    const user = await this.users.findOne({ userId });
    return user ?? null;
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
    const updatedUser = await this.users.findOne({ userId });
    if (updatedUser) {
      return this.users.save({ ...user, userId });
    }
    return null;
  }

  /**
   * Delete the user with the specified **Id**.
   *
   * @param userId - The **Id** of the {@link User} object to delete.
   *
   * @returns `true` if the {@link User} object with the specified **Id** was
   * found and deleted, `false` otherwise.
   *
   * @remarks
   * async, returns a Promise
   */
  async delete(userId: UserId) {
    const result = await this.users.delete({ userId });
    return !!result.affected;
  }

  /**
   * List all users stored in the database table.
   *
   * @returns An array of {@link User} objects stored in the table.
   *
   * @remarks
   * async, returns a Promise
   */
  async ls() {
    return this.users.find();
  }
}

export default UserRepo;

// __EOF__
