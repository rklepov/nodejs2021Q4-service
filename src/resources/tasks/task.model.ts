// task.model.ts

import pick from 'lodash.pick';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BoardColumnId } from '../boards/board-column.types';

import Board from '../boards/board.model';
import { BoardId, IBoardId } from '../boards/board.types';

import User from '../users/user.model';
import { UserId } from '../users/user.types';
import { ITask, TaskId } from './task.types';

/**
 * Models the Task object which holds the unique **Id** along with the fields
 * describing a task assigned to a board.
 */
@Entity()
class Task implements ITask {
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  /**
   * The unique task **Id**.
   */
  @PrimaryGeneratedColumn('uuid')
  taskId?: TaskId;

  /**
   * The title of the task.
   */
  @Column('varchar')
  title = '';

  /**
   * The order number of the task.
   */
  @Column('int')
  order = NaN;

  /**
   * The reference to the parent board of the task.
   */
  @ManyToOne(() => Board, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board?: Board;

  /**
   * The **Id** of the parent board of the task.
   */
  @Column({ nullable: false })
  boardId?: BoardId;

  /**
   * The task description.
   */
  @Column('varchar')
  description? = '';

  /**
   * The reference to the user of the task.
   */
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  /**
   * The **Id** of the user of the task (foreign key column)
   */
  @Column({ nullable: true })
  userId?: UserId;

  /**
   * The **Id** of the column of the task.
   */
  @Column('varchar', { nullable: true })
  columnId?: BoardColumnId;

  /**
   * The {@link Task} object constructor.
   *
   * @param task - An object with the fields matching {@link Task.schema}.
   */
  constructor(task: IBoardId & ITask) {
    Object.assign(
      this,
      pick(
        task,
        Object.keys(Board.schema.params.properties).concat(
          Object.keys(Task.schema.request.properties)
        )
      )
    );
  }

  /**
   * Returns the object **Id**.
   */
  get id() {
    return this.taskId;
  }

  /**
   * Returns DTO equivalent of the **Task** object. Eventually used as the JSON
   * body of HTTP response.
   *
   * @returns The DTO equivalent of the **Task** object.
   */
  toJSON() {
    return pick(this, Object.keys(Task.schema.response.properties));
  }

  /**
   * The JSON schema for the task object validation.
   *
   * @privateremarks
   * TODO: learn more about how to automatically generate this from OpenAPI spec
   */
  static schema = {
    tags: ['task'],

    params: {
      type: 'object',
      additionalProperties: false,
      required: ['boardId', 'taskId'],
      properties: {
        boardId: { type: 'string', format: 'uuid' },
        taskId: { type: 'string', format: 'uuid' },
      },
    },

    request: {
      type: 'object',
      required: ['title', 'order'],
      properties: {
        title: { type: 'string' },
        order: { type: 'integer' },
        description: { type: 'string' },
        userId: { type: 'string', nullable: true, format: 'uuid' },
        columnId: { type: 'string', nullable: true, format: 'uuid' },
      },
    },

    response: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        order: { type: 'integer' },
        description: { type: 'string' },
        userId: { type: 'string', nullable: true, format: 'uuid' },
        boardId: { type: 'string', format: 'uuid' },
        columnId: { type: 'string', nullable: true, format: 'uuid' },
      },
    },
  };
}

export default Task;

// __EOF__
