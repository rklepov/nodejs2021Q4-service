// column.model.ts

import * as uuid from 'uuid';
import pick from 'lodash.pick';

import { BoardId } from '../../db/database';

// TODO: inherit from Db table key type
type ColumnId = string;

// TODO: so far columns are not exposed as individual entities
//       (in fact this is not so easy to achieve because columns are nested
//        to a board and at the same the columns needs to be assigned an Id).
class Column {
  // TODO: wonder if the class fields can be somehow inferred from the JSON schema below?
  id: ColumnId = '';

  title = '';

  order = NaN;

  constructor(column) {
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

export { ColumnId, Column };
export default Column;

// __EOF__
