// column.model.ts

import pick from 'lodash.pick';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BoardColumnId, IBoardColumn } from './board-column.types';

// eslint-disable-next-line import/no-cycle
import Board from './board.model';
import { IBoardId } from './board.types';

/**
 * Models the Column object which holds the unique **Id** along with the fields
 * describing a column that belongs to a board.
 */
@Entity('board_column', {
  // ! this doesn't seem to work https://github.com/typeorm/typeorm/issues/2620
  orderBy: { order: 'ASC' },
})
class BoardColumn implements IBoardColumn {
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  /**
   * The unique column **Id**.
   */
  @PrimaryGeneratedColumn('uuid')
  columnId?: BoardColumnId;

  /**
   * The title of the column.
   */
  @Column('varchar')
  title = '';

  /**
   * The order of the column.
   */
  @Column('int')
  order = NaN;

  /**
   * The reference to the board of the column.
   */
  @ManyToOne(() => Board, (board) => board.columns, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'boardId' })
  board?: Board;

  /**
   * The {@link BoardColumn} object constructor.
   *
   * @param column - An object with the fields matching {@link BoardColumn.schema}.
   */
  constructor(column: IBoardId & IBoardColumn) {
    Object.assign(
      this,
      pick(column, Object.keys(BoardColumn.schema.request.properties))
    );
  }

  /**
   * Returns the object **Id**.
   */
  get id() {
    return this.columnId;
  }

  /**
   * Returns DTO equivalent of the **Column** object. Eventually used as the
   * JSON body of HTTP response.
   *
   * @returns The DTO equivalent of the **Column** object.
   */
  toJSON() {
    return pick(this, Object.keys(BoardColumn.schema.response.properties));
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

export default BoardColumn;

// __EOF__
