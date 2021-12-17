// board.memory.repository.ts

import { BoardsTable } from '../../db/database';

import Board, { BoardId } from './board.model';

class BoardRepo {
  boards: BoardsTable;

  constructor(boards: BoardsTable) {
    this.boards = boards;
  }

  async create(board: Board) {
    const { key: boardId } = await this.boards.create(board.id, board);
    board.columns.forEach((col) => col.assignToBoard(boardId));
    return board.assignId(boardId);
  }

  async read(boardId: BoardId) {
    const { hasValue: found, value: board } = await this.boards.read(boardId);
    // TODO: ?. is not needed here, the contract is that if found: true
    //       then the board is guaranteed to be present.
    //       Any way to describe this in TS?
    return found ? board?.assignId(boardId) || null : null;
  }

  async update(boardId: BoardId, board: Board) {
    const { updated: found, value: updatedBoard } = await this.boards.update(
      boardId,
      board
    );
    // TODO: same as in read() above
    return found ? updatedBoard?.assignId(boardId) || null : null;
  }

  async delete(boardId: BoardId) {
    const { deleted } = await this.boards.delete(boardId);
    return deleted;
  }

  async ls() {
    const boards = await this.boards.ls();
    return boards.map(({ key: boardId, value: board }) =>
      board.assignId(boardId)
    );
  }
}

export default BoardRepo;

// __EOF__
