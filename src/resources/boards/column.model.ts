// column.model.ts

import * as uuid from 'uuid';
import pick from 'lodash.pick';

import { BoardId, ColumnId } from '../../db/database';
import { IBoardId } from './board.model';

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
  // TODO: wonder if the class fields can be somehow inferred from the JSON schema below?
  columnId: ColumnId = ''; // TODO: the id shouldn't be an empty string

  title = '';

  order = NaN;

  boardId: BoardId = ''; // TODO: the id shouldn't be an empty string

  constructor(column: IColumn) {
    Object.assign(
      this,
      // TODO: there should be a single place for Id generation
      {
        id: uuid.v4(),
        ...pick(column, Object.keys(Column.schema.request.properties)),
      }
    );
  }

  assignToBoard(boardId: BoardId) {
    Object.assign(this, { boardId });
    return this;
  }

  toJSON() {
    const { columnId: id, ...rest } = this;
    return pick(
      { id, ...rest },
      Object.keys(Column.schema.response.properties)
    );
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
