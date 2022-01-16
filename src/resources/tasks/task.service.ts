// task.service.ts

import HTTP_STATUS from 'http-status';

import Logger from '../../common/logger';
import { reply } from '../../common/utils';

import { DatabaseConnection } from '../../db/database';

import { BoardId, IBoardService } from '../boards/board.types';

import {
  ITaskService,
  TaskGetAllRequest,
  TaskGetRequest,
  TaskPostRequest,
  TaskPutRequest,
  TaskDeleteRequest,
} from './task.types';

import Task from './task.model';
import TaskRepo from './task.memory.repository';

/**
 * HTTP request handlers for {@link Task}.
 */
class TaskService implements ITaskService {
  /**
   * Logger instance.
   */
  log: Logger;

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
   * @param log - {@link Logger} instance.
   * @param db - An instance of Typeorm database connection.
   * @param boardService - The instance of {@link BoardService} that allows
   * operations on the {@link Board} object linked to the {@link Task} object.
   */
  constructor(
    log: Logger,
    db: DatabaseConnection,
    boardService: IBoardService | null = null
  ) {
    this.log = log;
    this.repo = new TaskRepo(db);
    this.boardService = boardService;
  }

  /**
   * GET (all) request handler. List all stored tasks.
   *
   * @param __namedParameters - HTTP request parameters holding the **Id** of
   * the board which tasks are requested.
   *
   * @param params - HTTP request parameters holding the **Id** of the board
   * which tasks are requested.
   *
   * @returns An array of the currently stored tasks along with the
   * `HTTP.OK(200)` status code
   *
   * @remarks
   * async, returns a Promise
   */
  async getAll({ params }: TaskGetAllRequest) {
    const { boardId } = params;
    const tasks = await this.repo.ls(boardId);
    this.log.debug(`Returning ${tasks.length} task(s)`);
    return reply(HTTP_STATUS.OK, tasks);
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
    const { boardId, taskId } = params;
    const task = await this.repo.read(taskId);

    if (!(await this.boardService?.boardExists(boardId))) {
      this.log.warn(`[TaskService::get] Board with Id '${boardId}' not found`);
      return reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    // TODO: check that the task with this Id is really assigned to the board

    if (task) {
      return reply(HTTP_STATUS.OK, task);
    }
    this.log.warn(`[TaskService::get] Task with Id '${taskId}' not found`);
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
      this.log.warn(`[TaskService::add] Board with Id '${boardId}' not found`);
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
      this.log.warn(
        `[TaskService::update] Board with Id '${boardId}' not found`
      );
      return reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    // TODO: check that the task with this Id is really assigned to the board

    const task = await this.repo.update(taskId, new Task({ ...body, boardId }));

    if (task) {
      return reply(HTTP_STATUS.OK, task);
    }
    this.log.warn(`[TaskService::update] Task with Id '${taskId}' not found`);
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
      this.log.warn(
        `[TaskService::delete] Board with Id '${boardId}' not found`
      );
      return reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    // TODO: check that the task with this Id is really assigned to the board

    if (await this.repo.delete(taskId)) {
      return reply(HTTP_STATUS.NO_CONTENT);
    }
    this.log.warn(`[TaskService::delete] Task with Id '${taskId}' not found`);
    return reply(HTTP_STATUS.NOT_FOUND, { taskId });
  }

  /**
   * For the deleted board with **Id** = {@link boardId} also deletes the tasks
   * assigned to this board.
   *
   * @param boardId - The **Id** of the deleted {@link Board}.
   */
  async deleteTasksFor(boardId: BoardId) {
    await this.repo.deleteTasksFor(boardId);
  }
}

export default TaskService;

// __EOF__
