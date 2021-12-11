// board.memory.repository.js

class BoardRepo {
  constructor(db) {
    this.db = db;
  }

  async create(board, inputCols) {
    const boardId = await this.db.boards.create(board);

    const columns = inputCols.map(async (column) => {
      const id = await this.db.columns.create({ ...column, boardId });
      return { id, ...column };
    });

    return { id: boardId, ...board, columns: await Promise.all(columns) };
  }

  async read(boardId) {
    const { hasValue: hasBoard, value: board } = await this.db.boards.read(
      boardId
    );

    if (hasBoard) {
      const columns = await this.db.columns.where(
        (col) => col?.boardId === boardId
      );

      return {
        hasBoard,
        board: { id: boardId, ...board, columns },
      };
    }

    return { hasBoard };
  }

  async update(boardId, board, inputCols) {
    // ? probably should update the board's columns first ?
    const { updated, value: updatedBoard } = await this.db.boards.update(
      boardId,
      board
    );

    if (updated) {
      // ! replacing the set of columns of a board completely
      // TODO: this actually makes it the combination of delete + create
      //       can extract the common logic in the dedicated funcs
      let columns = await this.db.columns.where(
        (col) => col?.boardId === boardId
      );

      columns.forEach(async (col) => {
        await this.db.columns.delete(col.id);
      });

      columns = inputCols.map(async (column) => {
        const id = await this.db.columns.create({ ...column, boardId });
        return { id, ...column };
      });

      return {
        updated,
        board: {
          id: boardId,
          ...updatedBoard,
          columns: await Promise.all(columns),
        },
      };
    }

    return { updated };
  }

  async delete(boardId) {
    // ? probably should delete the board's columns first ?
    const { deleted } = await this.db.boards.delete(boardId);

    if (deleted) {
      // removing all columns of the board
      // TODO: move the code to a separate dedicated function
      const columns = await this.db.columns.where(
        (col) => col?.boardId === boardId
      );

      columns.forEach(async (col) => {
        await this.db.columns.delete(col.id);
      });

      // also removing all tasks attached to the board
      // TODO: move the code to a separate dedicated function
      const tasks = await this.db.tasks.where(
        (task) => task?.boardId === boardId
      );

      tasks.forEach(async (task) => {
        await this.db.tasks.delete(task.id);
      });
    }

    return deleted;
  }

  async ls() {
    let boards = await this.db.boards.ls();

    // enrich with columns
    boards = boards.map(async (board) => ({
      ...board,
      columns: await this.db.columns.where((col) => col?.boardId === board.id),
    }));

    return Promise.all(boards);
  }
}

module.exports = BoardRepo;

// __EOF__
