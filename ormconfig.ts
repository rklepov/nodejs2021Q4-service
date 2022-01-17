// ormconfig.ts

import dotenv from 'dotenv';
import path from 'path';

import User from './src/resources/users/user.model';
import Task from './src/resources/tasks/task.model';
import Board from './src/resources/boards/board.model';
import BoardColumn from './src/resources/boards/board-column.model';

dotenv.config({
  path: path.join(__dirname, '.env'),
});

export const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, PGHOST, PGPORT } =
  process.env;

export default {
  type: 'postgres',
  host: PGHOST,
  port: PGPORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [User, Task, Board, BoardColumn],
  migrations: ['src/db/migrations/*.ts'],
  cli: {
    /* entitiesDir: 'entity', */
    migrationsDir: 'src/db/migrations',
    /* subscribersDir: 'subscriber', */
  },
  migrationsRun: false,
  logging: true,
  synchronize: true,
};

//__EOF__
