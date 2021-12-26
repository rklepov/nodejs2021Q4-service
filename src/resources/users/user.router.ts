// user.router.ts

import HTTP_STATUS from 'http-status';

import fastify from 'fastify';

// import { defineHandler } from '../../common/handler';

import Logger from '../../common/logger';

import { Database } from '../../db/database';

import User from './user.model';
import { IUser, IUserId } from './user.types';
import UserService from './user.service';

import TaskService from '../tasks/task.service';

/**
 * Fastify server instance.
 *
 * TODO: this declaration is repeated in several files.
 */
type Server = ReturnType<typeof fastify>;

/**
 * Router object for `users` endpoints.
 */
class UserRouter {
  log: Logger;

  fastify: Server;

  service: UserService;

  /**
   * The router constructor. Sets up the endpoint handles for all supported HTTP
   * methods.
   *
   * @param log - {@link Logger} instance.
   * @param server - Fastify server instance.
   * @param db - Database instance.
   */
  constructor(log: Logger, server: Server, db: Database) {
    this.log = log;
    this.fastify = server;
    this.service = new UserService(
      log,
      db.users,
      new TaskService(log, db.tasks)
    );

    this.fastify.get<{ Params: Record<string, never> }>('/users', {
      // handler: defineHandler(this, 'getAll'),
      /**
       * The handler of GET request to '/users' endpoint.
       * @param _ - unused
       * @param p - Server response.
       */
      handler: async (_, p) => {
        const { status, payload } = await this.service.getAll();
        await p.code(status).send(payload);
      },
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

    this.fastify.get<{ Params: IUserId }>('/users/:userId', {
      // handler: defineHandler(this, 'get'),
      /**
       * The handler of GET request to '/users/:userId' endpoint.
       * @param q - Server request.
       * @param p - Server response.
       */
      handler: async (q, p) => {
        const { status, payload } = await this.service.get(q);
        await p.code(status).send(payload);
      },
      schema: {
        tags: User.schema.tags,
        params: User.schema.params,
        response: {
          [HTTP_STATUS.OK]: User.schema.response,
        },
      },
    });

    this.fastify.post<{ Body: IUser }>('/users', {
      // handler: defineHandler(this, 'add'),
      /**
       * The handler of POST request to '/users' endpoint.
       * @param q - Server request.
       * @param p - Server response.
       */
      handler: async (q, p) => {
        const { status, payload } = await this.service.add(q);
        await p.code(status).send(payload);
      },
      schema: {
        tags: User.schema.tags,
        body: User.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: User.schema.response,
        },
      },
    });

    this.fastify.put<{ Params: IUserId; Body: IUser }>('/users/:userId', {
      // handler: defineHandler(this, 'update'),
      /**
       * The handler of PUT request to '/users/:userId' endpoint.
       * @param q - Server request.
       * @param p - Server response.
       */
      handler: async (q, p) => {
        const { status, payload } = await this.service.update(q);
        await p.code(status).send(payload);
      },
      schema: {
        tags: User.schema.tags,
        params: User.schema.params,
        body: User.schema.request,
        response: {
          [HTTP_STATUS.OK]: User.schema.response,
        },
      },
    });

    this.fastify.delete<{ Params: IUserId }>('/users/:userId', {
      // handler: defineHandler(this, 'delete'),
      /**
       * The handler of DELETE request to '/users/:userId' endpoint.
       * @param q - Server request.
       * @param p - Server response.
       */
      handler: async (q, p) => {
        const { status, payload } = await this.service.delete(q);
        await p.code(status).send(payload);
      },
      schema: { tags: User.schema.tags, params: User.schema.params },
    });
  }
}

export default UserRouter;

// __EOF__
