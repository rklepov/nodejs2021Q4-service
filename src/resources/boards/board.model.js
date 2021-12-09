// board.model.js

import pick from 'lodash.pick';
import difference from 'lodash.difference';

import Column from './column.model.js';

class Board {
  constructor(board) {
    Object.assign(
      this,
      pick(
        board,
        difference(Object.keys(Board.schema.request.properties), ['columns'])
      )
    );

    this.assignColumns(
      pick(board, ['columns']).columns?.map((column) => new Column(column))
    );
  }

  assignId(boardId) {
    Object.assign(this, { id: boardId });
    return this;
  }

  assignColumns(columns) {
    this.columns = columns || [];
    return this;
  }

  toJSON() {
    return {
      ...pick(this, difference(Object.keys(this), ['columns'])),
      columns: this.columns.map((column) => column.toJSON()),
    };
  }

  // TODO: learn more about how to automatically generate this from OpenAPI spec
  static schema = {
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
        columns: { type: 'array', items: Column.schema.request },
      },
    },

    response: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        columns: { type: 'array', items: Column.schema.response },
      },
    },
  };
}

export default Board;

// __EOF__
