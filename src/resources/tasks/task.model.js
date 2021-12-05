// task.model.js

// TODO: learn more about how to automatically generate this from OpenAPI spec
const Task = {
  schema: {
    request: {
      type: 'object',
      required: ['title', 'order', 'boardId', 'columnId'],
      properties: {
        title: { type: 'string' },
        order: { type: 'integer' },
        description: { type: 'string' },
        userId: { type: 'string' },
        boardId: { type: 'string' },
        columnId: { type: 'string' },
      },
    },

    response: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        order: { type: 'integer' },
        description: { type: 'string' },
        userId: { type: 'string' },
        boardId: { type: 'string' },
        columnId: { type: 'string' },
      },
    },
  },
};

module.exports = Task;

// __EOF__
