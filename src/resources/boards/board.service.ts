// board.service.ts

import HTTP_STATUS from 'http-status';

import { reply } from '../../common/utils';

import { BoardsTable } from '../../db/database';

import { ITaskService } from '../tasks/task.types';

import {
  IBoardService,
  BoardId,
  BoardDeleteRequest,
  BoardGetRequest,
  BoardPostRequest,
  BoardPutRequest,
} from './board.types';

import Board from './board.model';
import BoardRepo from './board.memory.repository';

class BoardService implements IBoardService {
  repo: BoardRepo;

  taskService?: ITaskService;

  constructor(boards: BoardsTable, taskService?: ITaskService) {
    this.repo = new BoardRepo(boards);
    this.taskService = taskService;
  }

  async getAll() {
    return reply(HTTP_STATUS.OK, await this.repo.ls());
  }

  async get({ params }: BoardGetRequest) {
    const { boardId } = params;
    const board = await this.repo.read(boardId);

    if (board) {
      return reply(HTTP_STATUS.OK, board);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  async add({ body }: BoardPostRequest) {
    const board = new Board(body);
    return reply(HTTP_STATUS.CREATED, await this.repo.create(board));
  }

  async update({ params, body }: BoardPutRequest) {
    const { boardId } = params;
    const newBoard = new Board(body);
    const board = await this.repo.update(boardId, newBoard);

    if (board) {
      return reply(HTTP_STATUS.OK, board);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  async delete({ params }: BoardDeleteRequest) {
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
