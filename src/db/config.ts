// config.ts

import path from 'path';

import { ConfigService, registerAs } from '@nestjs/config';

import { BoardColumn } from './../board-columns/entities/board-column.entity';
import { Board } from './../boards/entities/board.entity';
import { Task } from './../tasks/entities/task.entity';
import { User } from './../users/entities/user.entity';

export default registerAs('database', async () => {
  const config = new ConfigService();
  return {
    type: 'postgres',
    host: config.get('PGHOST'),
    port: config.get('PGPORT'),
    username: config.get('POSTGRES_USER'),
    password: config.get('POSTGRES_PASSWORD'),
    database: config.get('POSTGRES_DB'),
    entities: [User, Task, BoardColumn, Board],
    autoLoadEntities: true,
    migrations: [`${path.join(__dirname, 'migrations', '*.{ts,js}')}`],
    cli: {
      migrationsDir: 'src/db/migrations',
    },
    migrationsRun: true,
    synchronize: false,
    logging: false,
  };
});

// __EOF__
