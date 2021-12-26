// app.ts

import path from 'path';

import fastify, { FastifyInstance } from 'fastify';
import swagger from 'fastify-swagger';

import Logger from './common/logger';

import { Database, createDatabase } from './db/database';

import UserRouter from './resources/users/user.router';
import User from './resources/users/user.model';

import BoardRouter from './resources/boards/board.router';
import Board from './resources/boards/board.model';

import TaskRouter from './resources/tasks/task.router';
import Task from './resources/tasks/task.model';

/**
 * The main application class representing the server instance.
 */
class App {
  /**
   * Server instance.
   */
  fastify: ReturnType<typeof fastify>;

  /**
   * Logger instance.
   */
  log: Logger;

  /**
   * Database instance.
   */
  db: Database;

  /**
   * The path to the OpenAPI schema spec YAML.
   */
  apiSpec: string; /* path */

  /**
   * Router instance for users endpoints.
   */
  userRouter: UserRouter;

  /**
   * Router instance for board endpoints.
   */
  boardRouter: BoardRouter;

  /**
   * Router instance for tasks endpoints.
   */
  taskRouter: TaskRouter;

  /**
   * Swagger instance.
   */
  swagger: FastifyInstance;

  /**
   * Application object constructor.
   * 1. Creates **fastify** instance.
   * 2. Creates **swagger** instance.
   * 3. Creates routes.
   *
   * The swagger will use the schemas defined in the routes to generate the UI
   * (available via `/doc` endpoint).
   */
  constructor(logger: Logger) {
    this.log = logger;

    this.db = createDatabase();

    this.fastify = fastify({
      logger: this.log.pinoLogger,
      ajv: {
        customOptions: {
          removeAdditional: true,
          useDefaults: true,
          coerceTypes: true,
          allErrors: true,
        },
      },
    });

    // hooks for printing the bodies of request and response to the log
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

    // error handler with extra logging
    this.fastify.setErrorHandler(async (e, q, p) => {
      const { statusCode } = e;
      if (statusCode) {
        if (statusCode >= 500) {
          q.log.error(e);
        } else if (statusCode >= 400) {
          q.log.warn(e);
        }
        await p.status(statusCode).send(e);
      } else {
        q.log.error(e);
        await p.send(e);
      }
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

    this.userRouter = new UserRouter(this.log, this.fastify, this.db);
    this.boardRouter = new BoardRouter(this.log, this.fastify, this.db);
    this.taskRouter = new TaskRouter(this.log, this.fastify, this.db);
  }

  /**
   * Start the server (start listening on the provided port number).
   *
   * @param port - The server port number.
   *
   * @throws Error
   * In the case of an issue (for example if the specified port number is
   * already occupied)
   */
  async start(port: number) {
    try {
      const addr = await this.fastify.listen(port);
      this.fastify.log.info(`[start] App is running on ${addr}`);
    } catch (e) {
      this.fastify.log.error(e);
      throw e;
    }
  }

  /**
   * Stop the server.
   */
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
