// task.service.ts

import HTTP_STATUS from 'http-status';

import { reply } from '../../common/utils';

import { TasksTable } from '../../db/database';

import { UserId } from '../users/user.types';

import { BoardId, IBoardService } from '../boards/board.types';

import {
  ITaskService,
  TaskGetRequest,
  TaskPostRequest,
  TaskPutRequest,
  TaskDeleteRequest,
} from './task.types';

import Task from './task.model';
import TaskRepo from './task.memory.repository';

class TaskService implements ITaskService {
  repo: TaskRepo;

  boardService: IBoardService | null;

  constructor(tasks: TasksTable, boardService: IBoardService | null = null) {
    this.repo = new TaskRepo(tasks);
    this.boardService = boardService;
  }

  async getAll() {
    return reply(HTTP_STATUS.OK, await this.repo.ls());
  }

  async get({ params }: TaskGetRequest) {
    const { taskId } = params;
    const task = await this.repo.read(taskId);

    if (task) {
      return reply(HTTP_STATUS.OK, task);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { taskId });
  }

  async add({ params, body }: TaskPostRequest) {
    const { boardId } = params;

    if (!(await this.boardService?.boardExists(boardId))) {
      return reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    const task = new Task({ ...body, boardId });
    return reply(HTTP_STATUS.CREATED, await this.repo.create(task));
  }

  async update({ params, body }: TaskPutRequest) {
    const { boardId, taskId } = params;

    if (!(await this.boardService?.boardExists(boardId))) {
      return reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    // TODO: check that the task with this Id is really assigned to the board

    const task = await this.repo.update(taskId, new Task({ ...body, boardId }));

    if (task) {
      return reply(HTTP_STATUS.OK, task);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { taskId });
  }

  async delete({ params }: TaskDeleteRequest) {
    const { boardId, taskId } = params;

    if (!(await this.boardService?.boardExists(boardId))) {
      return reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    // TODO: check that the task with this Id is really assigned to the board

    if (await this.repo.delete(taskId)) {
      return reply(HTTP_STATUS.NO_CONTENT);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { taskId });
  }

  async unassignUser(userId: UserId) {
    // set userId of the deleted users' tasks to null
    const tasks = await this.repo.getTasksFor(
      (task) => task?.userId === userId
    );

    await Promise.allSettled(
      tasks.map(async (task) => {
        const updatedTask = new Task(task); // TODO: new taskId now generated
        updatedTask.assignId(task.id);
        updatedTask.userId = null;
        await this.repo.update(task.id, updatedTask);
      })
    );
  }

  async deleteTasksFor(boardId: BoardId) {
    const tasks = await this.repo.getTasksFor(
      (task: Task) => task.boardId === boardId
    );

    await Promise.allSettled(
      tasks.map(async (task: Task) => {
        await this.repo.delete(task.taskId);
      })
    );
  }
}

export default TaskService;

// __EOF__
