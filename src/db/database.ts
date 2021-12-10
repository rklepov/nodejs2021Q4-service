// database.ts

import Table from './table';

import User from '../resources/users/user.model';
import Board from '../resources/boards/board.model';
import Task from '../resources/tasks/task.model';

type UsersTable = Table<User>;
type BoardsTable = Table<Board>;
type TasksTable = Table<Task>;

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

export { UsersTable, BoardsTable, TasksTable, Database, createDatabase };

// __EOF__
