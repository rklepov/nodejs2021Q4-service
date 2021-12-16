// board.model.ts

import pick from 'lodash.pick';
import difference from 'lodash.difference';

import { BoardId } from '../../db/database';

import Column, { IColumn } from './column.model';

interface IBoardId {
  boardId: BoardId;
}

interface IBoard {
  title: string;
  columns: IColumn[];
}

class Board implements IBoardId, IBoardId {
  // TODO: wonder if the class fields can be somehow inferred from the JSON schema below?
  boardId: BoardId = ''; // TODO: the id shouldn't be an empty string

  title = '';

  columns: Column[] = [];

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
        (column: IColumn) => new Column(column)
      )
    );
  }

  assignId(boardId: BoardId) {
    Object.assign(this, { boardId });
    return this;
  }

  assignColumns(columns: Column[]) {
    this.columns = columns || [];
    return this;
  }

  toJSON() {
    const { boardId: id, ...rest } = pick(
      this,
      difference(Object.keys(this), ['columns'])
    );

    return {
      id,
      ...rest,
      columns: this.columns.map((column: Column) => column.toJSON()),
    };
  }

  // TODO: learn more about how to automatically generate this from OpenAPI spec
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

export { BoardId, IBoardId, IBoard };
export default Board;

// __EOF__
