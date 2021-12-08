// board.router.js

const HTTP_STATUS = require('http-status');

const Board = require('./board.model');
const BoardService = require('./board.service');

const TaskService = require('../tasks/task.service');

class BoardRouter {
  constructor(fastify, db) {
    this.fastify = fastify;
    this.service = new BoardService(db.boards, new TaskService(db.tasks));

    this.fastify.get('/boards', {
      handler: async (q, p) => {
        const { status, payload } = await this.service.getAll();
        p.code(status).send(payload);
      },
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
      handler: async (q, p) => {
        const { status, payload } = await this.service.getBoard(q);
        p.code(status).send(payload);
      },
      schema: {
        params: Board.schema.params,
        response: {
          [HTTP_STATUS.OK]: Board.schema.response,
        },
      },
    });

    this.fastify.post('/boards', {
      handler: async (q, p) => {
        const { status, payload } = await this.service.addBoard(q);
        p.code(status).send(payload);
      },
      schema: {
        body: Board.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: Board.schema.response,
        },
      },
    });

    this.fastify.put('/boards/:boardId', {
      handler: async (q, p) => {
        const { status, payload } = await this.service.updateBoard(q);
        p.code(status).send(payload);
      },
      schema: {
        params: Board.schema.params,
        body: Board.schema.request,
        response: {
          [HTTP_STATUS.OK]: Board.schema.response,
        },
      },
    });

    this.fastify.delete('/boards/:boardId', {
      handler: async (q, p) => {
        const { status, payload } = await this.service.deleteBoard(q);
        p.code(status).send(payload);
      },
      schema: { params: Board.schema.params },
    });
  }
}

module.exports = BoardRouter;

// __EOF__
