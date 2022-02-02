// config.ts

import path from 'path';

import { ConfigService, registerAs } from '@nestjs/config';

import { BoardColumn } from './../board-columns/entities/board-column.entity';
import { Board } from './../boards/entities/board.entity';
import { Task } from './../tasks/entities/task.entity';
import { User } from './../users/entities/user.entity';

export default registerAs('database', async () => {
  const configService = new ConfigService();
  return {
    type: 'postgres',
    host: configService.get('PGHOST'),
    port: configService.get('PGPORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [User, Task, BoardColumn, Board],
    autoLoadEntities: true,
    migrations: [`${path.join(__dirname, 'migrations', '*.js')}`],
    cli: {
      migrationsDir: 'src/db/migrations',
    },
    migrationsRun: true,
    synchronize: false,
    logging: false,
  };
});

// __EOF__
