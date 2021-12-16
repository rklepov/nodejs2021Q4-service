// board.router.ts

import HTTP_STATUS from 'http-status';

import fastify from 'fastify';

import { defineHandler } from '../../common/handler';

import { Database } from '../../db/database';

import Board from './board.model';
import BoardService from './board.service';

import TaskService from '../tasks/task.service';

type Server = ReturnType<typeof fastify>;

class BoardRouter {
  fastify: Server;

  service: BoardService;

  constructor(server: Server, db: Database) {
    this.fastify = server;
    this.service = new BoardService(db.boards, new TaskService(db.tasks));

    this.fastify.get<>('/boards', {
      handler: defineHandler(this, 'getAll'),
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

    this.fastify.get('/boards/:boardId', {
      handler: defineHandler(this, 'get'),
      schema: {
        tags: Board.schema.tags,
        params: Board.schema.params,
        response: {
          [HTTP_STATUS.OK]: Board.schema.response,
        },
      },
    });

    this.fastify.post('/boards', {
      handler: defineHandler(this, 'add'),
      schema: {
        tags: Board.schema.tags,
        body: Board.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: Board.schema.response,
        },
      },
    });

    this.fastify.put('/boards/:boardId', {
      handler: defineHandler(this, 'update'),
      schema: {
        tags: Board.schema.tags,
        params: Board.schema.params,
        body: Board.schema.request,
        response: {
          [HTTP_STATUS.OK]: Board.schema.response,
        },
      },
    });

    this.fastify.delete('/boards/:boardId', {
      handler: defineHandler(this, 'delete'),
      schema: { tags: Board.schema.tags, params: Board.schema.params },
    });
  }
}

export default BoardRouter;

// __EOF__
