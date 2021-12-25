// task.model.ts

import pick from 'lodash.pick';

import { genId } from '../../common/utils';

import Board from '../boards/board.model';
import { BoardId, IBoardId } from '../boards/board.types';
import { ITaskId, ITask, TaskId } from './task.types';

/**
 * Models the Task object which holds the unique **Id** along with the fields
 * describing a task assigned to a board.
 */
class Task implements IBoardId, ITaskId, ITask {
  // ? wonder if the class fields can be somehow inferred from the JSON schema below ?
  /**
   * The unique task **Id**.
   */
  taskId: TaskId = genId(); // TODO: preferably should be private

  /**
   * The title of the task.
   */
  title = '';

  /**
   * The order number of the task.
   */
  order = NaN;

  /**
   * The **Id** of the board to which this task belongs.
   */
  boardId: BoardId = '';

  /**
   * The task description.
   */
  description? = '';

  /**
   * The **Id** of the use of the task.
   */
  userId?: string | null | undefined;

  /**
   * The **Id** of the column of the task.
   */
  columnId?: string | null | undefined;

  /**
   * The {@link Task} object constructor.
   *
   * @param Task - An object with the fields matching {@link Task.schema}.
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
   * Assigns **Id** to the user.
   *
   * @param taskId - The **Id** of the task.
   * @returns `this` {@link Task} object.
   *
   * @deprecated The **Id** is now stored in {@link Task} object itself.
   */
  assignId(taskId: TaskId) {
    Object.assign(this, { taskId });
    return this;
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
