// database.ts

/* eslint max-classes-per-file: ["error", 2] */

import pick from 'lodash.pick';

import { Connection, Repository } from 'typeorm';
import { getConnectionOptions, createConnection } from 'typeorm';

import Logger from '../common/logger';
import { ApplicationException } from '../common/except';

import User from '../resources/users/user.model';
import Board from '../resources/boards/board.model';
import Task from '../resources/tasks/task.model';

/**
 * Users table.
 */
type UsersTable = Repository<User>;

/**
 * Boards table.
 */
type BoardsTable = Repository<Board>;

/**
 * Tasks table.
 */
type TasksTable = Repository<Task>;

class DatabaseConnectionError extends ApplicationException {
  constructor(message: string) {
    super(message, DatabaseConnectionError.DATABASE_CONNECTION_ERROR);
  }
}

async function createDatabaseConnection(log: Logger) {
  const connectionOptions = await getConnectionOptions();
  try {
    const connection = await createConnection(connectionOptions);

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
  Connection as DatabaseConnection,
  createDatabaseConnection,
  DatabaseConnectionError,
};

// __EOF__
