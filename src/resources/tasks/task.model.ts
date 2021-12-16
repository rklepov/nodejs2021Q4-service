// task.model.ts

import pick from 'lodash.pick';

import { UserId, BoardId, TaskId, ColumnId } from '../../db/database';

import Board from '../boards/board.model';

class Task {
  // TODO: wonder if the class fields can be somehow inferred from the JSON schema below?
  id?: TaskId = '';

  title = '';

  order = NaN;

  boardId: BoardId = '';

  description? = '';

  userId?: UserId | null = '';

  columnId?: ColumnId | null = '';

  constructor(task) {
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
    Object.assign(this, { id: taskId });
    return this;
  }

  toJSON() {
    return pick(this, Object.keys(Task.schema.response.properties));
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

export default Task;

// __EOF__
