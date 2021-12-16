// user.router.ts

import HTTP_STATUS from 'http-status';

import http from 'http';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';

import { defineHandler } from '../../common/handler';

import { Database } from '../../db/database';

import User from './user.model';
import UserService from './user.service';

import TaskService from '../tasks/task.service';

// TODO: this should be inherited from the common declaration
type Server = FastifyInstance<
  http.Server,
  http.IncomingMessage,
  http.ServerResponse,
  FastifyLoggerInstance
>;

class UserRouter {
  fastify: Server;

  service: UserService;

  constructor(fastify: Server, db: Database) {
    this.fastify = fastify;
    this.service = new UserService(db.users, new TaskService(db.tasks));

    this.fastify.get('/users', {
      handler: defineHandler(this, 'getAll'),
      schema: {
        tags: ['user'],
        response: {
          [HTTP_STATUS.OK]: {
            type: 'array',
            items: User.schema.response,
          },
        },
      },
    });

    this.fastify.get('/users/:userId', {
      handler: defineHandler(this, 'getUser'),
      schema: {
        tags: User.schema.tags,
        params: User.schema.params,
        response: {
          [HTTP_STATUS.OK]: User.schema.response,
        },
      },
    });

    this.fastify.post('/users', {
      handler: defineHandler(this, 'addUser'),
      schema: {
        tags: User.schema.tags,
        body: User.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: User.schema.response,
        },
      },
    });

    this.fastify.put('/users/:userId', {
      handler: defineHandler(this, 'updateUser'),
      schema: {
        tags: User.schema.tags,
        params: User.schema.params,
        body: User.schema.request,
        response: {
          [HTTP_STATUS.OK]: User.schema.response,
        },
      },
    });

    this.fastify.delete('/users/:userId', {
      handler: defineHandler(this, 'deleteUser'),
      schema: { tags: User.schema.tags, params: User.schema.params },
    });
  }
}

export default UserRouter;

// __EOF__
