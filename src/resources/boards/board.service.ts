// board.service.ts

import HTTP_STATUS from 'http-status';

import { FastifyRequest } from 'fastify';

import { reply } from '../../common/reply';

import { BoardId, BoardsTable } from '../../db/database';

import TaskService from '../tasks/task.service';

import Board, { IBoard, IBoardId } from './board.model';
import BoardRepo from './board.memory.repository';

type BoardGetRequest = FastifyRequest<{ Params: IBoardId }>;
type BoardPostRequest = FastifyRequest<{ Body: IBoard }>;
type BoardPutRequest = FastifyRequest<{ Params: IBoardId; Body: IBoard }>;
type BoardDeleteRequest = FastifyRequest<{ Params: IBoardId }>;

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
