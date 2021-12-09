// db.js

import Table from './table.js';

function createDatabase() {
  return {
    users: new Table(),
    boards: new Table(),
    tasks: new Table(),
  };
}

export { createDatabase };

// __EOF__
