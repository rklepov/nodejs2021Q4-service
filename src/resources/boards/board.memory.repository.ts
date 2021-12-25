// board.memory.repository.ts

import { BoardsTable } from '../../db/database';

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
  constructor(boards: BoardsTable) {
    this.boards = boards;
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
   *
   * @privateRemarks
   * TODO: the object now stores the Id itself, no need to explicity assign it.
   */
  async create(board: Board) {
    const { key: boardId } = await this.boards.create(board.id, board);
    board.columns.forEach((col) => col.assignToBoard(boardId));
    return board.assignId(boardId);
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
    const { hasValue: found, value: board } = await this.boards.read(boardId);
    // TODO: ?. is not needed here, the contract is that if found: true
    //       then the board is guaranteed to be present.
    //       Any way to describe this in TS?
    return found ? board?.assignId(boardId) || null : null;
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
    const { updated: found, value: updatedBoard } = await this.boards.update(
      boardId,
      board
    );
    // TODO: same as in read() above
    return found ? updatedBoard?.assignId(boardId) || null : null;
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
    const { deleted } = await this.boards.delete(boardId);
    return deleted;
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
    const boards = await this.boards.ls();
    return boards.map(({ key: boardId, value: board }) =>
      board.assignId(boardId)
    );
  }
}

export default BoardRepo;

// __EOF__
