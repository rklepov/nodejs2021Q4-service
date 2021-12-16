// user.router.ts

import HTTP_STATUS from 'http-status';

import fastify from 'fastify';

// import { defineHandler } from '../../common/handler';

import { Database } from '../../db/database';

import User, { IUser, IUserId } from './user.model';
import UserService from './user.service';

import TaskService from '../tasks/task.service';

type Server = ReturnType<typeof fastify>;

class UserRouter {
  fastify: Server;

  service: UserService;

  constructor(server: Server, db: Database) {
    this.fastify = server;
    this.service = new UserService(db.users, new TaskService(db.tasks));

    this.fastify.get<{ Params: Record<string, never> }>('/users', {
      // handler: defineHandler(this, 'getAll'),
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
