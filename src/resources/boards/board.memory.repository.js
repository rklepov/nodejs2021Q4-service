// board.memory.repository.js

class BoardRepo {
  constructor(boards) {
    this.boards = boards;
  }

  async create(board) {
    const { key: boardId } = await this.boards.create(board);
    board.columns.forEach((col) => col.assignToBoard(boardId));
    return board.assignId(boardId);
  }

  async read(boardId) {
    const { hasValue: found, value: task } = await this.boards.read(boardId);
    return found ? task.assignId(boardId) : null;
  }

  async update(boardId, board) {
    const { updated: found, value: updatedBoard } = await this.boards.update(
      boardId,
      board
    );
    return found ? updatedBoard.assignId(boardId) : null;
  }

  async delete(boardId) {
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
