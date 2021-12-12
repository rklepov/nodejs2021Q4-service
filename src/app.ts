// app.ts

import path from 'path';
import http from 'http';

import fastify, { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import swagger from 'fastify-swagger';

import AjvCompiler from '@fastify/ajv-compiler';
import ajvFormats from 'ajv-formats';

import { Database, createDatabase } from './db/database';

import UserRouter from './resources/users/user.router';
import BoardRouter from './resources/boards/board.router';
import TaskRouter from './resources/tasks/task.router';

class App {
  fastify: FastifyInstance<
    http.Server,
    http.IncomingMessage,
    http.ServerResponse,
    FastifyLoggerInstance
  >;

  db: Database;

  apiSpec: string; /* path */

  userRouter: UserRouter;

  boardRouter: BoardRouter;

  taskRouter: TaskRouter;

  constructor() {
    this.db = createDatabase();

    this.fastify = fastify({
      logger: {
        prettyPrint: true,
        serializers: {
          res(p) {
            return {
              statusCode: p.statusCode,
              payload: p.raw.payload,
            };
          },
          req(q) {
            return {
              method: q.method,
              url: q.url,
              path: q.path,
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
        plugins: [ajvFormats],
      },
      schemaController: {
        compilersFactory: {
          buildValidator: AjvCompiler(),
        },
      },
    });

    this.fastify
      .addHook('preHandler', (q, _, done) => {
        if (q.body) {
          q.log.info({ body: q.body }, 'parsed body');
        }
        done();
      })
      .addHook('preSerialization', (_, p, payload, done) => {
        Object.assign(p.raw, { payload });
        done();
      });

    this.apiSpec = path.join(__dirname, '../doc/api.yaml');

    this.fastify.register(swagger, {
      exposeRoute: true,
      routePrefix: '/doc',
      mode: 'static',
      specification: {
        baseDir: path.dirname(this.apiSpec),
        path: this.apiSpec,
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
    }
  }

  async stop() {
    try {
      await this.fastify.close();
      this.fastify.log.info('[stop] Server closed');
    } catch (e) {
      this.fastify.log.error(e);
    }
  }
}

export default new App();

// __EOF__