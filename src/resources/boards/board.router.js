// board.router.js

const HTTP_STATUS = require('http-status');

const BoardRepo = require('./board.memory.repository');
const BoardService = require('./board.service');
const Board = require('./board.model');

class BoardRouter {
  constructor(fastify, db) {
    this.fastify = fastify;
    this.service = new BoardService(new BoardRepo(db));

    this.fastify.get('/boards', {
      handler: this.service.getAll.bind(this.service),
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
      handler: this.service.getBoard.bind(this.service),
      schema: {
        params: Board.schema.params,
        response: {
          [HTTP_STATUS.OK]: Board.schema.response,
        },
      },
    });

    this.fastify.post('/boards', {
      handler: this.service.addBoard.bind(this.service),
      schema: {
        body: Board.schema.request,
        response: {
          [HTTP_STATUS.CREATED]: Board.schema.response,
        },
      },
    });

    this.fastify.put('/boards/:boardId', {
      handler: this.service.updateBoard.bind(this.service),

      schema: {
        params: Board.schema.params,
        body: Board.schema.request,
        response: {
          [HTTP_STATUS.OK]: Board.schema.response,
        },
      },
    });

    this.fastify.delete('/boards/:boardId', {
      handler: this.service.deleteBoard.bind(this.service),
      schema: { params: Board.schema.params },
    });
  }
}

module.exports = BoardRouter;

// __EOF__
