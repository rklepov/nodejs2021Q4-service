// task.service.ts

import HTTP_STATUS from 'http-status';

import { reply } from '../../common/reply';

import { BoardId, TasksTable } from '../../db/database';

import { UserId } from '../users/user.model';

import BoardService from '../boards/board.service';

import Task from './task.model';
import TaskRepo from './task.memory.repository';

class TaskService {
  repo: TaskRepo;

  boardService: BoardService | null;

  constructor(tasks: TasksTable, boardService: BoardService | null = null) {
    this.repo = new TaskRepo(tasks);
    this.boardService = boardService;
  }

  async getAll() {
    return reply(HTTP_STATUS.OK, await this.repo.ls());
  }

  async getTask({ params }) {
    const { taskId } = params;
    const task = await this.repo.read(taskId);

    if (task) {
      return reply(HTTP_STATUS.OK, task);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { taskId });
  }

  async addTask({ params, body }) {
    const { boardId } = params;

    if (!(await this.boardService?.boardExists(boardId))) {
      return reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    const task = new Task({ ...body, boardId });
    return reply(HTTP_STATUS.CREATED, await this.repo.create(task));
  }

  async updateTask({ params, body }) {
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

  async deleteTask({ params }) {
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

    tasks.forEach(async (task) => {
      const updatedTask = new Task(task);
      updatedTask.userId = null;
      await this.repo.update(task.id, updatedTask);
    });
  }

  async deleteTasksFor(boardId: BoardId) {
    const tasks = await this.repo.getTasksFor(
      (task: Task) => task?.boardId === boardId
    );

    tasks.forEach(async (task: Task) => {
      await this.repo.delete(task.id);
    });
  }
}

export default TaskService;

// __EOF__
