// reply.ts

import { UserId, BoardId, TaskId } from '../db/database';
import Board from '../resources/boards/board.model';
import Task from '../resources/tasks/task.model';
import User from '../resources/users/user.model';

type Payload =
  | User
  | Board
  | Task
  | { userId: UserId }
  | { boardId: BoardId }
  | { taskId: TaskId };

export function reply(status: number, payload?: Payload) {
  return { status, payload };
}

// __EOF__
