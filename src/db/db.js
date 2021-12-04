// db.js

const Table = require('./table');

function createDatabase() {
  return {
    users: new Table(),
    boards: new Table(),
    tasks: new Table(),
  };
}

module.exports = { createDatabase };

// __EOF__
