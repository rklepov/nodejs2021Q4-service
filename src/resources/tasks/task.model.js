// task.model.js

const pick = require('lodash.pick');

const Board = require('../boards/board.model');

// TODO: learn more about how to automatically generate this from OpenAPI spec
class Task {
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

  toJSON() {
    return pick(this, Object.keys(this));
  }

  static schema = {
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
};

module.exports = Task;

// __EOF__
