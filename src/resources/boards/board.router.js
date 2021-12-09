// board.router.js

import HTTP_STATUS from 'http-status';

import { defineHandler } from '../../common/handler.js';

import Board from './board.model.js';
import BoardService from './board.service.js';

import TaskService from '../tasks/task.service.js';

class BoardRouter {
  constructor(fastify, db) {
    this.fastify = fastify;
    this.service = new BoardService(db.boards, new TaskService(db.tasks));

    this.fastify.get('/boards', {
      handler: defineHandler(this, 'getAll'),
      schema: {
        response: {
          [HTTP_STATUS.OK]: {
            type: 'array',
            items: Board.schema.response,
          },
        },
      },
    });

    this.fastify.get('/boards/:boardId', {
      handler: defineHandler(this, 'getBoard'),
      schema: {
        params: Board.schema.params,
        response: {
          [HTTP_STATUS.OK]: Board.schema.response,
        },
      },
    });

    this.fastify.post('/boards', {
      handler: defineHandler(this, 'addBoard'),
      schema: {
        body: Board.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: Board.schema.response,
        },
      },
    });

    this.fastify.put('/boards/:boardId', {
      handler: defineHandler(this, 'updateBoard'),
      schema: {
        params: Board.schema.params,
        body: Board.schema.request,
        response: {
          [HTTP_STATUS.OK]: Board.schema.response,
        },
      },
    });

    this.fastify.delete('/boards/:boardId', {
      handler: defineHandler(this, 'deleteBoard'),
      schema: { params: Board.schema.params },
    });
  }
}

export default BoardRouter;

// __EOF__