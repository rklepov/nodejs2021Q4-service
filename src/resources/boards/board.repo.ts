// board.memory.repository.ts

import { BoardsTable, DatabaseConnection } from '../../db/database';

import Board from './board.model';
import { BoardId } from './board.types';

/**
 * The board repository class: an abstraction layer over the database table.
 */
class BoardRepo {
  boards: BoardsTable;

  /**
   * The constructor takes аn instance of the Boards table and saves it in the
   * object property.
   *
   * @param boards - An instance of the Boards table.
   */
  constructor(db: DatabaseConnection) {
    this.boards = db.getRepository(Board);
  }

  /**
   * Adds new board to the database table.
   *
   * @param board - An instance of the {@link Board} object to save in the
   * database table
   *
   * @returns The same board object passed to the function.
   *
   * @remarks
   * async, returns a Promise
   */
  async create(board: Board) {
    return this.boards.save(board);
  }

  /**
   * Get the board by **Id**.
   *
   * @param boardId - The **Id** of the {@link Board} object to return.
   *
   * @returns The {@link Board} object or `null` if the board with the provided
   * **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async read(boardId: BoardId) {
    const board = this.boards
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.columns', 'column')
      .where('board.boardId = :boardId', { boardId })
      .orderBy({ 'board.boardId': 'ASC', 'column.order': 'ASC' })
      .getOne();

    return board ?? null;
  }

  /**
   * Update the board with the specified **Id**.
   *
   * @param boardId - The **Id** of the {@link Board} object to update.
   * @param board - The new instance of the {@link Board} object.
   *
   * @returns The updated {@link Board} object or `null` if the board with the
   * provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async update(boardId: BoardId, board: Board) {
    const updatedBoard = await this.boards.findOne({ boardId });
    if (updatedBoard) {
      return this.boards.save({ ...board, boardId });
    }
    return null;
  }

  /**
   * Delete the board with the specified **Id**.
   *
   * @param boardId - The **Id** of the {@link Board} object to delete.
   *
   * @returns `true` if the {@link Board} object with the specified **Id** was
   * found and deleted, `false` otherwise.
   *
   * @remarks
   * async, returns a Promise
   */
  async delete(boardId: BoardId) {
    const result = await this.boards.delete({ boardId });
    return !!result.affected;
  }

  /**
   * List all boards stored in the database table.
   *
   * @returns An array of {@link Board} objects stored in the table.
   *
   * @remarks
   * async, returns a Promise
   */
  async ls() {
    return this.boards
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.columns', 'column')
      .orderBy({ 'board.boardId': 'ASC', 'column.order': 'ASC' })
      .getMany();
  }
}

export default BoardRepo;

// __EOF__
