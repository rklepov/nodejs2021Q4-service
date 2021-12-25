// column.model.ts

import pick from 'lodash.pick';

import { genId } from '../../common/utils';

import { BoardId, IBoardId } from './board.types';
import { IColumnId, IColumn, ColumnId } from './column.types';

/**
 * Models the Column object which holds the unique **Id** along with the fields
 * describing a column that belongs to a board.
 *
 * @privateremarks
 * TODO: so far columns are not exposed as individual entities (in fact this is
 * not so easy to achieve because columns are nested to a board and at the same
 * the columns needs to be assigned an Id).
 */
class Column implements IColumnId, IBoardId, IColumn {
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  /**
   * The unique column **Id**.
   */
  columnId: ColumnId = genId(); // TODO: preferably should be private

  /**
   * The title of the column.
   */
  title = '';

  /**
   * The order of the column.
   */
  order = NaN;

  /**
   * The **Id** of the board to which this column belongs.
   */
  boardId: BoardId = ''; // TODO: the id shouldn't be an empty string

  /**
   * The {@link Column} object constructor.
   *
   * @param Column - An object with the fields matching {@link Column.schema}.
   */
  constructor(column: IColumn) {
    Object.assign(
      this,
      pick(column, Object.keys(Column.schema.request.properties))
    );
  }

  //
  /**
   * Sets the object **Id**.
   * @privateremarks
   * TODO: setter needed because the request can contain the column Id
   */
  set id(columnId: ColumnId) {
    this.columnId = columnId;
  }

  /**
   * Returns the object **Id**.
   */
  get id() {
    return this.columnId;
  }

  /**
   * Assigns the column to the board.
   *
   * @param boardId - The **Id** of the {@link Board} to which the column is
   * assigned to.
   *
   * @returns `this` {@link Column} object.
   */
  assignToBoard(boardId: BoardId) {
    Object.assign(this, { boardId });
    return this;
  }

  /**
   * Returns DTO equivalent of the **Column** object. Eventually used as the
   * JSON body of HTTP response.
   *
   * @returns The DTO equivalent of the **Column** object.
   */
  toJSON() {
    return pick(this, Object.keys(Column.schema.response.properties));
  }

  /**
   * The JSON schema for the column object validation.
   *
   * @privateremarks
   * TODO: learn more about how to automatically generate this from OpenAPI spec
   */
  static schema = {
    request: {
      type: 'object',
      required: ['title', 'order'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        order: { type: 'integer' },
      },
    },

    response: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        order: { type: 'integer' },
      },
    },
  };
}

export { ColumnId, IColumnId, IColumn };
export default Column;

// __EOF__
