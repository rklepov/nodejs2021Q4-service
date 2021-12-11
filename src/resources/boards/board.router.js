// board.router.js

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
          200: {
            type: 'array',
            items: Board.schema.response,
          },
        },
      },
    });

    this.fastify.get('/boards/:boardId', {
      handler: this.service.getBoard.bind(this.service),
      schema: {
        response: {
          200: Board.schema.response,
        },
      },
    });

    this.fastify.post('/boards', {
      handler: this.service.addBoard.bind(this.service),
      schema: {
        body: Board.schema.request,
        response: {
          201: Board.schema.response,
        },
      },
    });

    this.fastify.put('/boards/:boardId', {
      handler: this.service.updateBoard.bind(this.service),
      schema: {
        body: Board.schema.request,
        response: {
          200: Board.schema.response,
        },
      },
    });

    this.fastify.delete('/boards/:boardId', {
      handler: this.service.deleteBoard.bind(this.service),
    });
  }
}

module.exports = BoardRouter;

// __EOF__
