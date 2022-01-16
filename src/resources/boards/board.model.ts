// board.model.ts

import pick from 'lodash.pick';

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

// eslint-disable-next-line import/no-cycle
import Task from '../tasks/task.model';

import BoardColumn from './board-column.model';

import { IBoardId, BoardId, IBoard } from './board.types';

/**
 * Models the Board object which holds the unique **Id** along with the fields
 * describing a board.
 */
@Entity()
class Board implements IBoard {
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  /**
   * The unique board **Id**.
   */
  @PrimaryGeneratedColumn('uuid')
  boardId?: BoardId;

  /**
   * The title of the board.
   */
  @Column('varchar')
  title = '';

  /**
   * The list of columns of the board.
   */
  @Column('simple-json') // TODO: change to entity relation
  columns: BoardColumn[] = [];

  /**
   * The tasks of the board (relation).
   */
  @OneToMany(() => Task, (task) => task.user)
  tasks?: Task[];

  /**
   * The {@link Board} object constructor.
   *
   * @param board - An object with the fields matching {@link Board.schema}.
   */
  constructor(board: IBoard) {
    Object.assign(
      this,
      pick(board, Object.keys(Board.schema.request.properties))
    );
  }

  /**
   * Returns the object **Id**.
   */
  get id() {
    return this.boardId;
  }

  /**
   * Returns DTO equivalent of the **Board** object (will also include the list
   * of the columns of the board). Eventually used as the JSON body of HTTP
   * response.
   *
   * @returns The DTO equivalent of the **Board** object.
   */
  toJSON() {
    return pick(this, Object.keys(Board.schema.response.properties));
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
