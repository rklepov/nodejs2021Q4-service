// column.model.js

const uuid = require('uuid');
const pick = require('lodash.pick');

// TODO: so far columns are not exposed as individual entities
//       (in fact this is not so easy to achieve because columns are nested
//        to a board and at the same the columns needs to be assigned an Id).
class Column {
  constructor(column) {
    Object.assign(
      this,
      // TODO: there should be a single place for Id generation
      {
        id: uuid.v4(),
        ...pick(column, Object.keys(Column.schema.request.properties)),
      }
    );
  }

  assignToBoard(boardId) {
    Object.assign(this, { boardId });
    return this;
  }

  toJSON() {
    return pick(this, Object.keys(Column.schema.response.properties));
  }
}

Column.schema = {
  request: {
    type: 'object',
    required: ['title', 'order'],
    properties: {
      id: { type: 'string', format: 'uuid' },
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

module.exports = Column;

// __EOF__
