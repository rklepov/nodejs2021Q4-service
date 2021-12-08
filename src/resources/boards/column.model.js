// column.model.js

const pick = require('lodash.pick');

class Column {
  constructor(column) {
    Object.assign(
      this,
      pick(column, Object.keys(Column.schema.request.properties))
    );
  }

  toJSON() {
    return pick(this, Object.keys(this));
  }

  static schema = {
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
  };
}

module.exports = Column;

// __EOF__
