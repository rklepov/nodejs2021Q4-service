// board.model.js

const Column = {
  schema: {
    request: {
      type: 'object',
      required: ['title', 'order'],
      properties: {
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
  },
};

// TODO: learn more about how to automatically generate this from OpenAPI spec
const Board = {
  schema: {
    request: {
      type: 'object',
      required: ['title', 'columns'],
      properties: {
        title: { type: 'string' },
        columns: { type: 'array', items: Column.schema.request },
      },
    },

    response: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        columns: { type: 'array', items: Column.schema.response },
      },
    },
  },
};

module.exports = Board;

// __EOF__
