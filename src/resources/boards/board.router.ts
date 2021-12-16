// board.router.ts

import HTTP_STATUS from 'http-status';

import fastify from 'fastify';

// import { defineHandler } from '../../common/handler';

import { Database } from '../../db/database';

import Board, { IBoard, IBoardId } from './board.model';
import BoardService from './board.service';

import TaskService from '../tasks/task.service';

type Server = ReturnType<typeof fastify>;

class BoardRouter {
  fastify: Server;

  service: BoardService;

  constructor(server: Server, db: Database) {
    this.fastify = server;
    this.service = new BoardService(db.boards, new TaskService(db.tasks));

    this.fastify.get<{ Params: Record<string, never> }>('/boards', {
      // handler: defineHandler(this, 'getAll'),
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
