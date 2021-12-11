// database.ts

import Table, { KeyT } from './table';

import User from '../resources/users/user.model';
import Board from '../resources/boards/board.model';
import Task from '../resources/tasks/task.model';

type UsersTable = Table<User>;
type BoardsTable = Table<Board>;
type TasksTable = Table<Task>;

type UserId = KeyT;
type BoardId = KeyT;
type TaskId = KeyT;
// TODO: column is not a separate storage unit
type ColumnId = KeyT;

type Database = {
  users: UsersTable;
  boards: BoardsTable;
  tasks: TasksTable;
};

function createDatabase(): Database {
  return {
    users: new Table(),
    boards: new Table(),
    tasks: new Table(),
  };
}

export {
  UserId,
  BoardId,
  TaskId,
  ColumnId,
  UsersTable,
  BoardsTable,
  TasksTable,
  Database,
  createDatabase,
};

// __EOF__
