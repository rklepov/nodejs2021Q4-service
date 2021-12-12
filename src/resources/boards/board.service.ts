// board.service.ts

import HTTP_STATUS from 'http-status';

import { reply } from '../../common/reply';

import { BoardId, BoardsTable } from '../../db/database';

import TaskService from '../tasks/task.service';

import Board from './board.model';
import BoardRepo from './board.memory.repository';

class BoardService {
  repo: BoardRepo;

  taskService?: TaskService;

  constructor(boards: BoardsTable, taskService?: TaskService) {
    this.repo = new BoardRepo(boards);
    this.taskService = taskService;
  }

  async getAll() {
    return reply(HTTP_STATUS.OK, await this.repo.ls());
  }

  async getBoard({ params }) {
    const { boardId } = params;
    const board = await this.repo.read(boardId);

    if (board) {
      return reply(HTTP_STATUS.OK, board);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  async addBoard({ body }) {
    const board = new Board(body);
    return reply(HTTP_STATUS.CREATED, await this.repo.create(board));
  }

  async updateBoard({ params, body }) {
    const { boardId } = params;
    const newBoard = new Board(body);
    const board = await this.repo.update(boardId, newBoard);

    if (board) {
      return reply(HTTP_STATUS.OK, board);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  async deleteBoard({ params }) {
    const { boardId } = params;

    if (await this.repo.delete(boardId)) {
      await this.taskService?.deleteTasksFor(boardId);
      return reply(HTTP_STATUS.NO_CONTENT);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  async boardExists(boardId: BoardId) {
    return !!(await this.repo.read(boardId));
  }
}

export default BoardService;

// __EOF__
