// db.ts

import Table from './table';

function createDatabase() {
  return {
    users: new Table(),
    boards: new Table(),
    tasks: new Table(),
  };
}

export { createDatabase };

// __EOF__
