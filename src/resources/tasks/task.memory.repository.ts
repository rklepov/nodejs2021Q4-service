// task.memory.repository.ts

import { TaskId, TasksTable } from '../../db/database';

import Task from './task.model';

class TaskRepo {
  tasks: TasksTable;

  constructor(tasks: TasksTable) {
    this.tasks = tasks;
  }

  async create(task: Task) {
    const { key: taskId } = await this.tasks.create(task);
    return task.assignId(taskId);
  }

  async read(taskId: TaskId) {
    const { hasValue: found, value: task } = await this.tasks.read(taskId);
    // TODO: ?. is not needed here, the contract is that if found: true
    //       then the task is guaranteed to be present.
    //       Any way to describe this in TS?
    return found ? task?.assignId(taskId) || null : null;
  }

  async update(taskId: TaskId, task: Task) {
    const { updated: found, value: updatedTask } = await this.tasks.update(
      taskId,
      task
    );
    // TODO: same as in read() above
    return found ? updatedTask?.assignId(taskId) || null : null;
  }

  async delete(taskId: TaskId) {
    const { deleted } = await this.tasks.delete(taskId);
    return deleted;
  }

  async ls() {
    return TaskRepo.assignIds(await this.tasks.ls());
  }

  async getTasksFor(pred: (task: Task) => boolean) {
    return TaskRepo.assignIds(await this.tasks.where(pred));
  }

  static assignIds(tasks: { key: TaskId; value: Task }[]) {
    return tasks.map(({ key: taskId, value: task }) => task.assignId(taskId));
  }
}

export default TaskRepo;

// __EOF__
