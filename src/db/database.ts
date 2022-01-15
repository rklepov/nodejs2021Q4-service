// database.ts

/* eslint max-classes-per-file: ["error", 2] */

import pick from 'lodash.pick';

import { Connection, ConnectionOptions } from 'typeorm';
import { getConnectionOptions, createConnection } from 'typeorm';

import Logger from '../common/logger';
import { ApplicationException } from '../common/except';

import User from '../resources/users/user.model';
import { UserId } from '../resources/users/user.types';
import Board from '../resources/boards/board.model';
import { BoardId } from '../resources/boards/board.types';
import Task from '../resources/tasks/task.model';
import { TaskId } from '../resources/tasks/task.types';

import Table from './table';

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

class DatabaseConnectionError extends ApplicationException {
  constructor(message: string) {
    super(message, DatabaseConnectionError.DATABASE_CONNECTION_ERROR);
  }
}

async function createDatabaseConnection(log: Logger) {
  const connectionOptions = await getConnectionOptions();
  try {
    const connection = await createConnection({
      ...connectionOptions,
      entities: [User],
    });

    return connection;
  } catch (e) {
    let message = `Failed to set up database connection with ${JSON.stringify(
      pick(connectionOptions, ['type', 'host', 'port', 'username', 'database'])
    )}`;

    if (e instanceof Error) {
      message = `${message}: [${e.name} ${e.message}]`;
    } else {
      message = `${message}: ${String(e)}]`;
    }

    // rethrow typed error
    throw new DatabaseConnectionError(message);
  }
}

export {
  UsersTable,
  BoardsTable,
  TasksTable,
  Database,
  createDatabase,
  Connection as DatabaseConnection,
  createDatabaseConnection,
  DatabaseConnectionError,
};

// __EOF__
