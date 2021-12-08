// board.service.js

const HTTP_STATUS = require('http-status');

const Board = require('./board.model');
const BoardRepo = require('./board.memory.repository');

class BoardService {
  constructor(boards, taskService) {
    this.repo = new BoardRepo(boards);
    this.taskService = taskService;
  }

  async getAll(q, p) {
    p.send(await this.repo.ls());
  }

  async getBoard(q, p) {
    const { boardId } = q.params;
    const board = await this.repo.read(boardId);

    if (board) {
      p.send(board);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ boardId });
    }
  }

  async addBoard(q, p) {
    const board = new Board(q.body);
    p.code(HTTP_STATUS.CREATED).send(await this.repo.create(board));
  }

  async updateBoard(q, p) {
    const { boardId } = q.params;
    const newBoard = new Board(q.body);
    const board = await this.repo.update(boardId, newBoard);

    if (board) {
      p.send(board);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ boardId });
    }
  }

  async deleteBoard(q, p) {
    const { boardId } = q.params;

    if (await this.repo.delete(boardId)) {
      await this.taskService.deleteTasksFor(boardId);
      p.code(HTTP_STATUS.NO_CONTENT).send();
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ boardId });
    }
  }

  async boardExists(boardId) {
    return !!(await this.repo.read(boardId));
  }
}

module.exports = BoardService;

// __EOF__
