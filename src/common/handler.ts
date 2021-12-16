// handler.ts

import { FastifyReply, FastifyRequest } from 'fastify';

import BoardService from '../resources/boards/board.service';
import TaskService from '../resources/tasks/task.service';
import UserService from '../resources/users/user.service';

interface IRouter {
  service: UserService | BoardService | TaskService;
}

type ServiceCalls = 'getAll' | 'get' | 'add' | 'update' | 'delete';

export function defineHandler<
  RequesT extends FastifyRequest,
  ReplyT extends FastifyReply
>(router: IRouter, f: ServiceCalls) {
  return async (q: RequesT, p: ReplyT) => {
    const { status, payload } = await router.service[f](q);
    await p.code(status).send(payload);
  };
}

// __EOF__
