// app.ts

import path from 'path';

import fastify, { FastifyInstance } from 'fastify';
import swagger from 'fastify-swagger';

import { Database, createDatabase } from './db/database';

import UserRouter from './resources/users/user.router';
import User from './resources/users/user.model';

import BoardRouter from './resources/boards/board.router';
import Board from './resources/boards/board.model';

import TaskRouter from './resources/tasks/task.router';
import Task from './resources/tasks/task.model';

class App {
  fastify: ReturnType<typeof fastify>;

  db: Database;

  apiSpec: string; /* path */

  userRouter: UserRouter;

  boardRouter: BoardRouter;

  taskRouter: TaskRouter;

  swagger: FastifyInstance;

  constructor() {
    this.db = createDatabase();

    this.fastify = fastify({
      logger: {
        prettyPrint: true,
        serializers: {
          res(p) {
            return {
              statusCode: p.statusCode,
            };
          },
          req(q) {
            return {
              method: q.method,
              url: q.url,
              params: q.params,
              headers: q.headers,
            };
          },
        },
      },
      ajv: {
        customOptions: {
          removeAdditional: true,
          useDefaults: true,
          coerceTypes: true,
          allErrors: true,
        },
      },
    });

    this.fastify
      .addHook('preHandler', (q, _, done) => {
        if (q.body) {
          q.log.info({ body: q.body }, 'parsed request body');
        }
        done();
      })
      .addHook('preSerialization', (_, p, payload, done) => {
        if (payload) {
          p.log.info({ payload }, 'response body');
        }
        done();
      });

    this.apiSpec = path.join(__dirname, '../doc/api.yaml');

    this.swagger = this.fastify.register(swagger, {
      exposeRoute: true,
      routePrefix: '/doc',
      swagger: {
        info: {
          title: 'Trello Service',
          description: "Let's try to create a competitor for Trello!",
          version: '1.1.0',
        },
        tags: [
          { name: 'user', description: 'Users related end-points' },
          { name: 'board', description: 'Boards related end-points' },
          { name: 'task', description: 'Tasks related end-points' },
        ],
        definitions: {
          User: User.schema.request,
          Board: Board.schema.request,
          Task: Task.schema.request,
        },
      },
    });

    this.userRouter = new UserRouter(this.fastify, this.db);
    this.boardRouter = new BoardRouter(this.fastify, this.db);
    this.taskRouter = new TaskRouter(this.fastify, this.db);
  }

  async start(port: number) {
    try {
      const addr = await this.fastify.listen(port);
      this.fastify.log.info(`[start] App is running on ${addr}`);
    } catch (e) {
      this.fastify.log.error(e);
      throw e;
    }
  }

  async stop() {
    try {
      await this.fastify.close();
      this.fastify.log.info('[stop] Server closed');
    } catch (e) {
      this.fastify.log.error(e);
      throw e;
    }
  }
}

export default App;

// __EOF__
