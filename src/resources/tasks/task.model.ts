// task.model.ts

import pick from 'lodash.pick';

import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ColumnId } from '../boards/column.types';

import Board from '../boards/board.model';
import { IBoardId } from '../boards/board.types';

// eslint-disable-next-line import/no-cycle
import User from '../users/user.model';
import { UserId } from '../users/user.types';

import { ITaskId, ITask, TaskId } from './task.types';

/**
 * Models the Task object which holds the unique **Id** along with the fields
 * describing a task assigned to a board.
 */
@Entity()
class Task implements IBoardId, ITask {
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
   * The **Id** of the board to which this task belongs.
   */
  @Column('varchar')
  boardId = '';

  /**
   * The task description.
   */
  @Column('varchar')
  description? = '';

  /**
   * The reference to the user of the task.
   */
  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'SET NULL' })
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
  columnId?: ColumnId;

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

export { TaskId, ITaskId, ITask };
export default Task;

// __EOF__
