// app.js

import path from 'path';
import { fileURLToPath } from 'url';

// const YAML = require('yamljs');

import Fastify from 'fastify';
import AjvCompiler from '@fastify/ajv-compiler';
import ajvFormats from 'ajv-formats';
import swagger from 'fastify-swagger';

import { createDatabase } from './db/db.js';

import UserRouter from './resources/users/user.router.js';
import BoardRouter from './resources/boards/board.router.js';
import TaskRouter from './resources/tasks/task.router.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class App {
  constructor() {
    this.db = createDatabase();

    this.fastify = Fastify({
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
          strictTypes: true,
          strictRequired: true,
          validateFormats: true,
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
        path: this.apiSpec,
      },
    });

    this.userRouter = new UserRouter(this.fastify, this.db);
    this.boardRouter = new BoardRouter(this.fastify, this.db);
    this.boardRouter = new TaskRouter(this.fastify, this.db);
  }

  start(port) {
    return this.fastify
      .listen(port)
      .then((addr) => {
        this.fastify.log.info(`[start] App is running on ${addr}`);
      })
      .catch((e) => {
        this.fastify.log.error(e);
      });
  }

  stop() {
    return this.fastify
      .close()
      .then(() => {
        this.fastify.log.info('[stop] Server closed');
      })
      .catch((e) => {
        this.fastify.log.error(e);
      });
  }
}

export default new App();

// __EOF__
