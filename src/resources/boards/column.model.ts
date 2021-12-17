// column.model.ts

import pick from 'lodash.pick';

import { genId } from '../../common/utils';

interface IColumnId {
  columnId: ColumnId;
}

interface IColumn {
  title: string;
  order: number;
}

// TODO: so far columns are not exposed as individual entities
//       (in fact this is not so easy to achieve because columns are nested
//        to a board and at the same the columns needs to be assigned an Id).
class Column implements IColumnId, IBoardId, IColumn {
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  columnId: ColumnId = genId(); // TODO: preferably should be private

  title = '';

  order = NaN;

  boardId: BoardId = ''; // TODO: the id shouldn't be an empty string

  constructor(column: IColumn) {
    Object.assign(
      this,
      pick(column, Object.keys(Column.schema.request.properties))
    );
  }

  // TODO: setter needed because the request can contain the column Id
  set id(columnId: ColumnId) {
    this.columnId = columnId;
  }

  get id() {
    return this.columnId;
  }

  assignToBoard(boardId: BoardId) {
    Object.assign(this, { boardId });
    return this;
  }

  toJSON() {
    return pick(this, Object.keys(Column.schema.response.properties));
  }

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
