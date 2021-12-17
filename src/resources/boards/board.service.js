// board.service.js

const HTTP_STATUS = require('http-status');

const { Reply } = require('../../common/reply');

const Board = require('./board.model');
const BoardRepo = require('./board.memory.repository');

class BoardService {
  constructor(boards, taskService) {
    this.repo = new BoardRepo(boards);
    this.taskService = taskService;
  }

  async getAll() {
    return Reply(HTTP_STATUS.OK, await this.repo.ls());
  }

  async getBoard({ params }) {
    const { boardId } = params;
    const board = await this.repo.read(boardId);

    if (board) {
      return Reply(HTTP_STATUS.OK, board);
    }
    return Reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  async addBoard({ body }) {
    const board = new Board(body);
    return Reply(HTTP_STATUS.CREATED, await this.repo.create(board));
  }

  async updateBoard({ params, body }) {
    const { boardId } = params;
    const newBoard = new Board(body);
    const board = await this.repo.update(boardId, newBoard);

    if (board) {
      return Reply(HTTP_STATUS.OK, board);
    }
    return Reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  async deleteBoard({ params }) {
    const { boardId } = params;

    if (await this.repo.delete(boardId)) {
      await this.taskService.deleteTasksFor(boardId);
      return Reply(HTTP_STATUS.NO_CONTENT);
    }
    return Reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  async boardExists(boardId) {
    return !!(await this.repo.read(boardId));
  }
}

module.exports = BoardService;

// __EOF__
