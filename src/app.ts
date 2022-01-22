// app.ts

/* eslint max-classes-per-file: ["error", 2] */

import 'reflect-metadata';

import omit from 'lodash.omit';

import path from 'path';

import fastify, { FastifyInstance } from 'fastify';
import fastifySensible from 'fastify-sensible';
import swagger from 'fastify-swagger';

import Logger from './common/logger';
import { ApplicationException } from './common/except';

import { DatabaseConnection } from './db/database';

import UserRouter from './resources/users/user.router';
import User from './resources/users/user.model';

import BoardRouter from './resources/boards/board.router';
import Board from './resources/boards/board.model';

import TaskRouter from './resources/tasks/task.router';
import Task from './resources/tasks/task.model';
import LoginRouter from './resources/login/login.router';

export class ServerStartError extends ApplicationException {
  constructor(message: string) {
    super(message, ServerStartError.SERVER_START_ERROR);
  }
}

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
   * The instance of typeorm database connection.
   */
  db: DatabaseConnection;

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
   * Router instance for user login endpoint.
   */
  loginRouter: LoginRouter;

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
   *
   * @privateremarks
   * TODO: the constructor function became too long, consider splitting it in
   *       smaller chunks
   */
  constructor(logger: Logger, db: DatabaseConnection) {
    this.log = logger;

    this.db = db;

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
          q.log.info(
            { body: omit(q.body as Record<string, unknown>, ['password']) },
            'parsed request body'
          );
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

    // 404 not found handler with extra warn logging
    this.fastify.setNotFoundHandler({}, (q, p) => {
      // https://github.com/fastify/fastify/issues/1025
      // https://github.com/fastify/fastify/blob/v3.25.2/lib/fourOhFour.js#L50
      const msg = `Route ${q.method}:${q.url} not found`;
      q.log.warn(q, msg);
      p.notFound(msg);
    });

    this.apiSpec = path.join(__dirname, '../doc/api.yaml');

    this.swagger = this.fastify.register(swagger, {
      exposeRoute: true,
      routePrefix: '/doc',
      swagger: {
        info: {
          title: 'Trello Service',
          description: "Let's try to create a competitor for Trello!",
          // TODO: sync with package.json (via env var?)
          version: '2.1.1',
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

    this.loginRouter = new LoginRouter(this.log, this.fastify, this.db);
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
  async start(port: number, addr?: string) {
    try {
      await this.fastify.register(fastifySensible);
      const addrPort = await this.fastify.listen(port, addr);
      this.fastify.log.info(`[start] App is running on ${addrPort}`);
    } catch (e) {
      this.fastify.log.error(e);

      let message = `Failed to start server`;

      if (e instanceof Error) {
        message = `${message}: [${e.name}] ${e.message}`;
      } else {
        message = `${message}: ${String(e)}]`;
      }

      throw new ServerStartError(message);
    }
  }

  /**
   * Stop the server.
   */
  async stop() {
    try {
      await this.fastify.close();
      this.fastify.log.info('[stop] Server closed');
      await this.db.close();
      this.fastify.log.info('[stop] Database connection closed');
    } catch (e) {
      this.fastify.log.error(e);
      throw e;
    }
  }
}

export default App;

// __EOF__
