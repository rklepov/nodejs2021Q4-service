// task.repo.ts

import { DatabaseConnection, TasksTable } from '../../db/database';

import { BoardId } from '../boards/board.types';

import Task from './task.model';
import { TaskId } from './task.types';

/**
 * The task repository class: an abstraction layer over the database table.
 */
class TaskRepo {
  tasks: TasksTable;

  /**
   * The constructor takes аn instance of the Tasks table and saves it in the
   * object property.
   *
   * @param tasks - An instance of the Tasks table.
   */
  constructor(db: DatabaseConnection) {
    this.tasks = db.getRepository(Task);
  }

  /**
   * Adds new task to the database table.
   *
   * @param task - An instance of the {@link Task} object to save in the
   * database table
   *
   * @returns The same task object passed to the function.
   *
   * @remarks
   * async, returns a Promise
   */
  async create(task: Task) {
    return this.tasks.save(task);
  }

  /**
   * Get the task by **Id**.
   *
   * @param taskId - The **Id** of the {@link Task} object to return.
   *
   * @returns The {@link Task} object or `null` if the task with the provided
   * **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async read(taskId: TaskId) {
    const task = await this.tasks.findOne(taskId);
    return task ?? null;
  }

  /**
   * Update the task with the specified **Id**.
   *
   * @param taskId - The **Id** of the {@link Task} object to update.
   * @param task - The new instance of the {@link Task} object.
   *
   * @returns The updated {@link Task} object or `null` if the task with the
   * provided **Id** wasn't found.
   *
   * @remarks
   * async, returns a Promise
   */
  async update(taskId: TaskId, task: Task) {
    const updatedTask = await this.tasks.findOne({ taskId });
    if (updatedTask) {
      return this.tasks.save({ ...task, taskId });
    }
    return null;
  }

  /**
   * Delete the task with the specified **Id**.
   *
   * @param taskId - The **Id** of the {@link Task} object to delete.
   *
   * @returns `true` if the {@link Task} object with the specified **Id** was
   * found and deleted, `false` otherwise.
   *
   * @remarks
   * async, returns a Promise
   */
  async delete(taskId: TaskId) {
    const result = await this.tasks.delete({ taskId });
    return !!result.affected;
  }

  /**
   * List all tasks stored in the database table.
   *
   * @param boardId - The **Id** of the {@link Board} which task list is
   * requested. If not provided all tasks for all boards are returned.
   *
   * @returns An array of {@link Task} objects stored in the table.
   *
   * @remarks
   * async, returns a Promise
   */
  async ls(boardId?: BoardId) {
    if (boardId) {
      return this.tasks.find({
        where: { boardId },
        // TODO: order is repeated
        order: {
          order: 'ASC',
        },
      });
    }
    return this.tasks.find({
      order: {
        order: 'ASC',
      },
    });
  }
}

export default TaskRepo;

// __EOF__
