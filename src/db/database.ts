// database.ts

import Table from './table';

import User, { UserId } from '../resources/users/user.model';
import Board, { BoardId } from '../resources/boards/board.model';
import Task, { TaskId } from '../resources/tasks/task.model';

type UsersTable = Table<UserId, User>;
type BoardsTable = Table<BoardId, Board>;
type TasksTable = Table<TaskId, Task>;

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
