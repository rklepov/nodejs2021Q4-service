// handler.ts

import BoardRouter from '../resources/boards/board.router';
import TaskRouter from '../resources/tasks/task.router';
import UserRouter from '../resources/users/user.router';

type Router = UserRouter | BoardRouter | TaskRouter;

export function defineHandler(router: Router, f) {
  return async (q, p) => {
    const { status, payload } = await router.service[f](q);
    p.code(status).send(payload);
  };
}

// __EOF__
