// board.model.ts

import pick from 'lodash.pick';
import difference from 'lodash.difference';

import { genId } from '../../common/utils';

import BoardColumn from './board-column.model';
import { IBoardColumn } from './board-column.types';

import { IBoardId, BoardId, IBoard } from './board.types';

/**
 * Models the Board object which holds the unique **Id** along with the fields
 * describing a board.
 */
class Board implements IBoardId, IBoard {
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  /**
   * The unique board **Id**.
   */
  boardId: BoardId = genId(); // TODO: preferably should be private

  /**
   * The title of the board.
   */
  title = '';

  /**
   * The list of columns of the board.
   */
  columns: BoardColumn[] = [];

  /**
   * The {@link Board} object constructor.
   *
   * @param board - An object with the fields matching {@link Board.schema}.
   */
  constructor(board: IBoard) {
    Object.assign(
      this,
      pick(
        board,
        difference(Object.keys(Board.schema.request.properties), ['columns'])
      )
    );

    this.assignColumns(
      pick(board, ['columns']).columns?.map(
        (column: IBoardColumn) => new BoardColumn(column)
      )
    );
  }

  /**
   * Returns the object **Id**.
   */
  get id() {
    return this.boardId;
  }

  /**
   * Assigns **Id** to the user.
   *
   * @param boardId - The **Id** of the board.
   * @returns `this` {@link Board} object.
   *
   * @deprecated The **Id** is now stored in {@link Board} object itself.
   */
  assignId(boardId: BoardId) {
    Object.assign(this, { boardId });
    return this;
  }

  /**
   * Assigns the list of columns to the board.
   *
   * @param columns - The array of {@link Column} objects that belong to the
   * board.
   * @returns
   */
  assignColumns(columns: BoardColumn[]) {
    this.columns = columns || [];
    return this;
  }

  /**
   * Returns DTO equivalent of the **Board** object (will also include the list
   * of the columns of the board). Eventually used as the JSON body of HTTP
   * response.
   *
   * @returns The DTO equivalent of the **Board** object.
   */
  toJSON() {
    return {
      ...pick(
        this,
        difference(Object.keys(Board.schema.response.properties), ['columns'])
      ),
      columns: this.columns.map((column: BoardColumn) => column.toJSON()),
    };
  }

  /**
   * The JSON schema for the board object validation.
   *
   * @privateremarks
   * TODO: learn more about how to automatically generate this from OpenAPI spec
   */
  static schema = {
    tags: ['board'],

    params: {
      type: 'object',
      additionalProperties: false,
      required: ['boardId'],
      properties: {
        boardId: { type: 'string', format: 'uuid' },
      },
    },

    request: {
      type: 'object',
      required: ['title', 'columns'],
      properties: {
        title: { type: 'string' },
        columns: { type: 'array', items: BoardColumn.schema.request },
      },
    },

    response: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        columns: { type: 'array', items: BoardColumn.schema.response },
      },
    },
  };
}

export { BoardId, IBoardId, IBoard };
export default Board;

// __EOF__
