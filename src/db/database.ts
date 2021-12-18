// database.ts

import Table from './table';

import User from '../resources/users/user.model';
import { UserId } from '../resources/users/user.types';
import Board from '../resources/boards/board.model';
import { BoardId } from '../resources/boards/board.types';
import Task from '../resources/tasks/task.model';
import { TaskId } from '../resources/tasks/task.types';

/**
 * Users table.
 */
type UsersTable = Table<UserId, User>;

/**
 * Boards table.
 */
type BoardsTable = Table<BoardId, Board>;

/**
 * Tasks table.
 */
type TasksTable = Table<TaskId, Task>;

/**
 * The abstraction of the database: an object containing 3 tables.
 */
type Database = {
  users: UsersTable;
  boards: BoardsTable;
  tasks: TasksTable;
};

/**
 * Creates an instance of the database.
 *
 * @returns Database instance.
 */
function createDatabase(): Database {
  return {
    users: new Table(),
    boards: new Table(),
    tasks: new Table(),
  };
}

export { UsersTable, BoardsTable, TasksTable, Database, createDatabase };

// __EOF__
