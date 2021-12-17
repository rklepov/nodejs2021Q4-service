// board.model.ts

import pick from 'lodash.pick';
import difference from 'lodash.difference';

import { genId } from '../../common/utils';

import Column from './column.model';
import { IColumn } from './column.types';
import { IBoardId, BoardId, IBoard } from './board.types';

class Board implements IBoardId, IBoardId {
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  boardId: BoardId = genId(); // TODO: preferably should be private

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

  get id() {
    return this.boardId;
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
    return {
      ...pick(
        this,
        difference(Object.keys(Board.schema.response.properties), ['columns'])
      ),
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
