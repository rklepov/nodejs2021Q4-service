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

/**
 * HTTP request handlers for {@link Task}.
 *
 * @privateremarks
 * TODO: some return types of the methods below are not inferred by TS
 * correctly, need to understand the reason of that and maybe specify the types
 * explicitly
 */
class TaskService implements ITaskService {
  /**
   * Tasks repository: an interface to the database table.
   */
  repo: TaskRepo;

  /**
   * Board service. Allows operations on the {@link Board} objects which are
   * linked to the {@link Task}.
   */
  boardService: IBoardService | null;

  /**
   * The constructor of the {@link TaskService} instance.
   *
   * @param tasks - An instance of the Users table.
   * @param boardService - The instance of {@link BoardService} that allows
   * operations on the {@link Board} object linked to the {@link Task} object.
   */
  constructor(tasks: TasksTable, boardService: IBoardService | null = null) {
    this.repo = new TaskRepo(tasks);
    this.boardService = boardService;
  }

  /**
   * GET (all) request handler. List all stored tasks.
   *
   * @returns An array of the currently stored tasks along with the
   * `HTTP.OK(200)` status code
   *
   * @remarks
   * async, returns a Promise
   */
  async getAll() {
    return reply(HTTP_STATUS.OK, await this.repo.ls());
  }

  /**
   * GET request handler. Get the task by **Id**.
   *
   * @param __namedParameters - HTTP request parameters holding the requested
   * task **Id**.
   *
   * @param params - HTTP request parameters holding the requested task **Id**.
   *
   * @returns The task object and `HTTP.OK(200)` status, or
   * `HTTP.NOT_FOUND(404)` if the task with the provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async get({ params }: TaskGetRequest) {
    const { taskId } = params;
    const task = await this.repo.read(taskId);

    if (task) {
      return reply(HTTP_STATUS.OK, task);
    }
    return reply(HTTP_STATUS.NOT_FOUND, { taskId });
  }

  /**
   * POST request handler. Add a new task.
   *
   * @param __namedParameters - HTTP request body holding the added task fields.
   *
   * @param body - HTTP request body holding the added task fields.
   *
   * @returns The newly created task object with assigned **Id** and
   * `HTTP.OK(200)` status, or `HTTP.NOT_FOUND(404)` if the task with the
   * provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async add({ params, body }: TaskPostRequest) {
    const { boardId } = params;

    if (!(await this.boardService?.boardExists(boardId))) {
      return reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    const task = new Task({ ...body, boardId });
    return reply(HTTP_STATUS.CREATED, await this.repo.create(task));
  }

  /**
   * PUT request handler. Update the task by **Id**.
   *
   * @param __namedParameters - HTTP request parameters holding the updated task
   * **Id** and HTTP request body with the task fields validated by the schema.
   *
   * @param params - HTTP request parameters holding the updated task **Id**.
   * @param body - HTTP request body with the task fields validated by the
   * schema.
   *
   * @returns The updated task object and `HTTP.OK(200)` status, or
   * `HTTP.NOT_FOUND(404)` if the task with the provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
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

  /**
   * DELETE request handler. Delete the task by **Id**.
   *
   * @param __namedParameters - HTTP request parameters holding the deleted task
   * **Id**.
   *
   * @param params - HTTP request parameters holding the deleted task **Id**.
   *
   * @returns The task object and `HTTP_STATUS.NO_CONTENT(204)` status, or
   * `HTTP.NOT_FOUND(404)` if the task with the provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
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

  /**
   * For the deleted user with **Id** = {@link userId} sets the respective field
   * of the task to `null`.
   *
   * @param userId - The **Id** of the deleted {@link User}.
   */
  async unassignUser(userId: UserId) {
    // set userId of the deleted users' tasks to null
    const tasks = await this.repo.getTasksFor(
      (task) => task?.userId === userId
    );

    tasks.map(async (task) => {
      const updatedTask = new Task(task); // TODO: new taskId now generated
      updatedTask.assignId(task.id);
      updatedTask.userId = null;
      await this.repo.update(task.id, updatedTask);
    });
  }

  /**
   * For the deleted board with **Id** = {@link boardId} also deletes the tasks
   * assigned to this board.
   *
   * @param boardId - The **Id** of the deleted {@link Board}.
   */
  async deleteTasksFor(boardId: BoardId) {
    const tasks = await this.repo.getTasksFor(
      (task: Task) => task.boardId === boardId
    );

    tasks.map(async (task: Task) => {
      await this.repo.delete(task.taskId);
    });
  }
}

export default TaskService;

// __EOF__
