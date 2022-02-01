// app.module.ts

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { BoardColumnsModule } from './board-columns/board-columns.module';
import { BoardsModule } from './boards/boards.module';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { LoggerModule } from './common/logger/logger.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

import dbConfig from './db/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),

    LoggerModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),

    UsersModule,
    TasksModule,
    BoardColumnsModule,
    BoardsModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

// __EOF__
