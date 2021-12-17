// task.memory.repository.js

class TaskRepo {
  constructor(tasks) {
    this.tasks = tasks;
  }

  async create(task) {
    const { key: taskId } = await this.tasks.create(task);
    return task.assignId(taskId);
  }

  async read(taskId) {
    const { hasValue: found, value: task } = await this.tasks.read(taskId);
    return found ? task.assignId(taskId) : null;
  }

  async update(taskId, task) {
    const { updated: found, value: updatedTask } = await this.tasks.update(
      taskId,
      task
    );
    return found ? updatedTask.assignId(taskId) : null;
  }

  async delete(taskId) {
    const { deleted } = await this.tasks.delete(taskId);
    return deleted;
  }

  async ls() {
    return TaskRepo.assignIds(await this.tasks.ls());
  }

  async getTasksFor(pred) {
    return TaskRepo.assignIds(await this.tasks.where(pred));
  }

  static assignIds(tasks) {
    return tasks.map(({ key: taskId, value: task }) => task.assignId(taskId));
  }
}

module.exports = TaskRepo;

// __EOF__
