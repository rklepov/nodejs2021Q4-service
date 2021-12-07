// task.model.js

// TODO: learn more about how to automatically generate this from OpenAPI spec
const Task = {
  schema: {
    request: {
      type: 'object',
      required: ['title', 'order'],
      properties: {
        title: { type: 'string' },
        order: { type: 'integer' },
        description: { type: 'string' },
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
  },
};

module.exports = Task;

// __EOF__
