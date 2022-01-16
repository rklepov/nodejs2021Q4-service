// board.router.ts

import HTTP_STATUS from 'http-status';

import fastify from 'fastify';

// import { defineHandler } from '../../common/handler';

import Logger from '../../common/logger';

import { Database, DatabaseConnection } from '../../db/database';

import Board from './board.model';
import { IBoard, IBoardId } from './board.types';
import BoardService from './board.service';

import TaskService from '../tasks/task.service';

/**
 * Fastify server instance.
 *
 * TODO: this declaration is repeated in several files.
 */
type Server = ReturnType<typeof fastify>;

/**
 * Router object for `boards` endpoints.
 */
class BoardRouter {
  fastify: Server;

  service: BoardService;

  /**
   * The router constructor. Sets up the endpoint handles for all supported HTTP
   * methods.
   *
   * @param log - {@link Logger} instance.
   * @param server - Fastify server instance.
   * @param db - Database connection.
   */
  constructor(
    log: Logger,
    server: Server,
    inmemDb: Database, // TODO: temporary
    db: DatabaseConnection
  ) {
    this.fastify = server;
    this.service = new BoardService(
      log,
      inmemDb.boards, // TODO: temporary
      new TaskService(log, db)
    );

    this.fastify.get<{ Params: Record<string, never> }>('/boards', {
      // handler: defineHandler(this, 'getAll'),
      /**
       * The handler of GET request to '/boards' endpoint.
       * @param _ - unused
       * @param p - Server response.
       */
      handler: async (_, p) => {
        const { status, payload } = await this.service.getAll();
        await p.code(status).send(payload);
      },
      schema: {
        tags: Board.schema.tags,
        response: {
          [HTTP_STATUS.OK]: {
            type: 'array',
            items: Board.schema.response,
          },
        },
      },
    });

    this.fastify.get<{ Params: IBoardId }>('/boards/:boardId', {
      // handler: defineHandler(this, 'get'),
      /**
       * The handler of GET request to '/boards/:boardId' endpoint.
       * @param q - Server request.
       * @param p - Server response.
       */
      handler: async (q, p) => {
        const { status, payload } = await this.service.get(q);
        await p.code(status).send(payload);
      },
      schema: {
        tags: Board.schema.tags,
        params: Board.schema.params,
        response: {
          [HTTP_STATUS.OK]: Board.schema.response,
        },
      },
    });

    this.fastify.post<{ Body: IBoard }>('/boards', {
      // handler: defineHandler(this, 'add'),
      /**
       * The handler of POST request to '/boards' endpoint.
       * @param q - Server request.
       * @param p - Server response.
       */
      handler: async (q, p) => {
        const { status, payload } = await this.service.add(q);
        await p.code(status).send(payload);
      },
      schema: {
        tags: Board.schema.tags,
        body: Board.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: Board.schema.response,
        },
      },
    });

    this.fastify.put<{ Params: IBoardId; Body: IBoard }>('/boards/:boardId', {
      // handler: defineHandler(this, 'update'),
      /**
       * The handler of PUT request to '/boards/:boardId' endpoint.
       * @param q - Server request.
       * @param p - Server response.
       */
      handler: async (q, p) => {
        const { status, payload } = await this.service.update(q);
        await p.code(status).send(payload);
      },
      schema: {
        tags: Board.schema.tags,
        params: Board.schema.params,
        body: Board.schema.request,
        response: {
          [HTTP_STATUS.OK]: Board.schema.response,
        },
      },
    });

    this.fastify.delete<{ Params: IBoardId }>('/boards/:boardId', {
      // handler: defineHandler(this, 'delete'),
      /**
       * The handler of DELETE request to '/boards/:boardId' endpoint.
       * @param q - Server request.
       * @param p - Server response.
       */
      handler: async (q, p) => {
        const { status, payload } = await this.service.delete(q);
        await p.code(status).send(payload);
      },
      schema: { tags: Board.schema.tags, params: Board.schema.params },
    });
  }
}

export default BoardRouter;

// __EOF__
