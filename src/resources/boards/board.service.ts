// board.service.ts

import HTTP_STATUS from 'http-status';

import Logger from '../../common/logger';
import { reply } from '../../common/utils';

import { DatabaseConnection } from '../../db/database';

import {
  IBoardService,
  BoardId,
  BoardDeleteRequest,
  BoardGetRequest,
  BoardPostRequest,
  BoardPutRequest,
} from './board.types';

import Board from './board.model';
import BoardRepo from './board.repo';

/**
 * HTTP request handlers for {@link Board}.
 */
class BoardService implements IBoardService {
  /**
   * Logger instance.
   */
  log: Logger;

  /**
   * Boards repository: an interface to the database table.
   */
  repo: BoardRepo;

  /**
   * The constructor of the {@link BoardService} instance.
   *
   * @param log - {@link Logger} instance.
   * @param db - An instance of Typeorm database connection.
   * operations on the {@link Task} object linked to the {@link Board} object.
   */
  constructor(log: Logger, db: DatabaseConnection) {
    this.log = log;
    this.repo = new BoardRepo(db);
  }

  /**
   * GET (all) request handler. List all stored boards.
   *
   * @returns An array of the currently stored boards along with the
   * `HTTP.OK(200)` status code
   *
   * @remarks
   * async, returns a Promise
   */
  async getAll() {
    const boards = await this.repo.ls();
    this.log.debug(`Returning ${boards.length} board(s)`);
    return reply(HTTP_STATUS.OK, boards);
  }

  /**
   * GET request handler. Get the board by **Id**.
   *
   * @param __namedParameters - HTTP request parameters holding the requested
   * board **Id**.
   *
   * @param params - HTTP request parameters holding the requested board **Id**.
   *
   * @returns The board object and `HTTP.OK(200)` status, or
   * `HTTP.NOT_FOUND(404)` if the board with the provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async get({ params }: BoardGetRequest) {
    const { boardId } = params;
    const board = await this.repo.read(boardId);

    if (board) {
      return reply(HTTP_STATUS.OK, board);
    }
    this.log.warn(`[BoardService::get] Board with Id '${boardId}' not found`);
    return reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  /**
   * POST request handler. Add a new board.
   *
   * @param __namedParameters - HTTP request body holding the added board
   * fields.
   *
   * @param body - HTTP request body holding the added board fields.
   *
   * @returns The newly created board object with assigned **Id** and
   * `HTTP.OK(200)` status, or `HTTP.NOT_FOUND(404)` if the board with the
   * provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async add({ body }: BoardPostRequest) {
    const board = new Board(body);
    return reply(HTTP_STATUS.CREATED, await this.repo.create(board));
  }

  /**
   * PUT request handler. Update the board by **Id**.
   *
   * @param __namedParameters - HTTP request parameters holding the updated
   * board **Id** and HTTP request body with the board fields validated by the
   * schema.
   *
   * @param params - HTTP request parameters holding the updated board **Id**.
   * @param body - HTTP request body with the board fields validated by the
   * schema.
   *
   * @returns The updated board object and `HTTP.OK(200)` status, or
   * `HTTP.NOT_FOUND(404)` if the board with the provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async update({ params, body }: BoardPutRequest) {
    const { boardId } = params;
    const newBoard = new Board(body);
    const board = await this.repo.update(boardId, newBoard);

    if (board) {
      return reply(HTTP_STATUS.OK, board);
    }
    this.log.warn(
      `[BoardService::update] Board with Id '${boardId}' not found`
    );
    return reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  /**
   * DELETE request handler. Delete the board by **Id**.
   *
   * @param __namedParameters - HTTP request parameters holding the deleted
   * board **Id**.
   *
   * @param params - HTTP request parameters holding the deleted board **Id**.
   *
   * @returns The board object and `HTTP_STATUS.NO_CONTENT(204)` status, or
   * `HTTP.NOT_FOUND(404)` if the board with the provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async delete({ params }: BoardDeleteRequest) {
    const { boardId } = params;

    if (await this.repo.delete(boardId)) {
      return reply(HTTP_STATUS.NO_CONTENT);
    }
    this.log.warn(
      `[BoardService::delete] Board with Id '${boardId}' not found`
    );
    return reply(HTTP_STATUS.NOT_FOUND, { boardId });
  }

  async boardExists(boardId: BoardId) {
    return !!(await this.repo.read(boardId));
  }
}

export default BoardService;

// __EOF__
