// task.model.ts

import pick from 'lodash.pick';

import { TaskId, BoardId, ColumnId } from '../../db/database';

import Board, { IBoardId } from '../boards/board.model';

interface ITaskId {
  taskId: TaskId;
}

interface ITask {
  title: string;
  order: number;
  description?: string;
  columnId?: ColumnId | null;
}

class Task implements IBoardId, ITaskId, ITask {
  // TODO: wonder if the class fields can be somehow inferred from the JSON schema below?
  taskId: TaskId = ''; // TODO: the id shouldn't be an empty string

  title = '';

  order = NaN;

  boardId: BoardId = '';

  description? = '';

  userId?: string | null | undefined;

  columnId?: string | null | undefined;

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

  assignId(taskId: TaskId) {
    Object.assign(this, { taskId });
    return this;
  }

  toJSON() {
    const { taskId: id, ...rest } = this;
    return pick({ id, ...rest }, Object.keys(Task.schema.response.properties));
  }

  // TODO: learn more about how to automatically generate this from OpenAPI spec
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
