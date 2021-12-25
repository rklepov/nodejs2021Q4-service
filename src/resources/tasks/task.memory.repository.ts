// task.memory.repository.ts

import { TasksTable } from '../../db/database';

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
  constructor(tasks: TasksTable) {
    this.tasks = tasks;
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
   *
   * @privateRemarks
   * TODO: the object now stores the Id itself, no need to explicity assign it.
   */
  async create(task: Task) {
    const { key: taskId } = await this.tasks.create(task.id, task);
    return task.assignId(taskId);
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
    const { hasValue: found, value: task } = await this.tasks.read(taskId);
    // TODO: ?. is not needed here, the contract is that if found: true
    //       then the task is guaranteed to be present.
    //       Any way to describe this in TS?
    return found ? task?.assignId(taskId) || null : null;
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
    const { updated: found, value: updatedTask } = await this.tasks.update(
      taskId,
      task
    );
    // TODO: same as in read() above
    return found ? updatedTask?.assignId(taskId) || null : null;
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
    const { deleted } = await this.tasks.delete(taskId);
    return deleted;
  }

  /**
   * List all tasks stored in the database table.
   *
   * @returns An array of {@link Task} objects stored in the table.
   *
   * @remarks
   * async, returns a Promise
   */
  async ls() {
    return TaskRepo.assignIds(await this.tasks.ls());
  }

  /**
   * Return the tasks matching the provided predicate.
   *
   * @param pred - The function that returns `true` if the task should be
   * returned or `false` otherwise.
   *
   * @returns The array of {@link Task} object for which the predicate returns
   * `true`.
   *
   * @remarks
   * async, returns a Promise
   */
  async getTasksFor(pred: (task: Task) => boolean) {
    return TaskRepo.assignIds(await this.tasks.where(pred));
  }

  /**
   * The utility function used to assign the Ids to the tasks from the list.
   * @param tasks - The array of `{ key, value }` pairs where the `key` is the
   * **Id** of the task which will be assigned to the respective task in
   * `value`.
   * @returns The array of tasks with the Ids assigned.
   * @deprecated The **Id** is now stored in {@link Task} object itself.
   */
  private static assignIds(tasks: { key: TaskId; value: Task }[]) {
    return tasks.map(({ key: taskId, value: task }) => task.assignId(taskId));
  }
}

export default TaskRepo;

// __EOF__
