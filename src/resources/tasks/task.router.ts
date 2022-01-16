// task.router.ts

import HTTP_STATUS from 'http-status';

import fastify from 'fastify';

// import { defineHandler } from '../../common/handler';

import Logger from '../../common/logger';

import { Database, DatabaseConnection } from '../../db/database';

import Task from './task.model';
import { ITask, ITaskId } from './task.types';
import TaskService from './task.service';

import Board from '../boards/board.model';
import { IBoardId } from '../boards/board.types';
import BoardService from '../boards/board.service';

/**
 * Fastify server instance.
 *
 * TODO: this declaration is repeated in several files.
 */
type Server = ReturnType<typeof fastify>;

/**
 * Router object for `boards/:boardId/tasks` endpoints.
 */
class TaskRouter {
  log: Logger;

  fastify: Server;

  service: TaskService;

  /**
   * The router constructor. Sets up the endpoint handles for all supported HTTP
   * methods.
   *
   * @param log - {@link Logger} instance.
   * @param server - Fastify server instance.
   * @param db - Database instance.
   */
  constructor(
    log: Logger,
    server: Server,
    inmemDb: Database, // TODO: temporary
    db: DatabaseConnection
  ) {
    this.log = log;
    this.fastify = server;
    this.service = new TaskService(
      log,
      db,
      new BoardService(log, inmemDb.boards) // TODO: temporary
    );

    this.fastify.get<{ Params: IBoardId }>('/boards/:boardId/tasks', {
      // handler: defineHandler(this, 'getAll'),
      /**
       * The handler of GET request to '/boards/:boardId/tasks' endpoint
       * @param _ - unused
       * @param p - Server response.
       */
      handler: async (q, p) => {
        const { status, payload } = await this.service.getAll(q);
        await p.code(status).send(payload);
      },
      schema: {
        tags: Task.schema.tags,
        params: Board.schema.params,
        response: {
          [HTTP_STATUS.OK]: {
            type: 'array',
            items: Task.schema.response,
          },
        },
      },
    });

    this.fastify.get<{ Params: IBoardId & ITaskId }>(
      '/boards/:boardId/tasks/:taskId',
      {
        // handler: defineHandler(this, 'get'),
        /**
         * The handler of GET request to '/boards/:boardId/tasks' endpoint
         * @param q - Server request.
         * @param p - Server response.
         */
        handler: async (q, p) => {
          const { status, payload } = await this.service.get(q);
          await p.code(status).send(payload);
        },
        schema: {
          tags: Task.schema.tags,
          params: Task.schema.params,
          response: {
            [HTTP_STATUS.OK]: Task.schema.response,
          },
        },
      }
    );

    this.fastify.post<{ Params: IBoardId; Body: ITask }>(
      '/boards/:boardId/tasks',
      {
        // handler: defineHandler(this, 'add'),
        /**
         * The handler of POST request to '/boards/:boardId/tasks' endpoint.
         * @param q - Server request.
         * @param p - Server response.
         */
        handler: async (q, p) => {
          const { status, payload } = await this.service.add(q);
          await p.code(status).send(payload);
        },
        schema: {
          tags: Task.schema.tags,
          params: Board.schema.params,
          body: Task.schema.request,
          response: {
            [HTTP_STATUS.CREATED]: Task.schema.response,
          },
        },
      }
    );

    this.fastify.put<{ Params: IBoardId & ITaskId; Body: ITask }>(
      '/boards/:boardId/tasks/:taskId',
      {
        // handler: defineHandler(this, 'update'),
        /**
         * The handler of PUT request to '/boards/:boardId/tasks/:taskId'
         * endpoint.
         * @param q - Server request.
         * @param p - Server response.
         */
        handler: async (q, p) => {
          const { status, payload } = await this.service.update(q);
          await p.code(status).send(payload);
        },
        schema: {
          tags: Task.schema.tags,
          params: Task.schema.params,
          body: Task.schema.request,
          response: {
            [HTTP_STATUS.OK]: Task.schema.response,
          },
        },
      }
    );

    this.fastify.delete<{ Params: IBoardId & ITaskId }>(
      '/boards/:boardId/tasks/:taskId',
      {
        // handler: defineHandler(this, 'delete'),
        /**
         * The handler of DELETE request to '/boards/:boardId/tasks/:taskId'
         * endpoint.
         * @param q - Server request.
         * @param p - Server response.
         */
        handler: async (q, p) => {
          const { status, payload } = await this.service.delete(q);
          await p.code(status).send(payload);
        },
        schema: { tags: Task.schema.tags, params: Task.schema.params },
      }
    );
  }
}

export default TaskRouter;

// __EOF__
