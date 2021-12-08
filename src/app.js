// app.js

const path = require('path');

// const YAML = require('yamljs');

const Fastify = require('fastify');
const AjvCompiler = require('@fastify/ajv-compiler');
const ajvFormats = require('ajv-formats');
const swagger = require('fastify-swagger');

const { createDatabase } = require('./db/db');

const UserRouter = require('./resources/users/user.router');
const BoardRouter = require('./resources/boards/board.router');
const TaskRouter = require('./resources/tasks/task.router');

class App {
  constructor() {
    this.db = createDatabase();

    this.fastify = Fastify({
      logger: { prettyPrint: true },
      ajv: {
        customOptions: {
          removeAdditional: true,
          useDefaults: true,
          coerceTypes: true,
          allErrors: true,
          strictTypes: true,
          nullable: true,
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

module.exports = new App();

// __EOF__
