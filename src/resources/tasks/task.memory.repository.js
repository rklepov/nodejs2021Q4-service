// task.memory.repository.js

class TaskRepo {
  constructor(tasks) {
    this.tasks = tasks;
  }

  async create(task) {
    const id = await this.tasks.create(task);
    return { id, ...task };
  }

  async read(id) {
    const { hasValue: hasTask, value: task } = await this.tasks.read(id);
    return { hasTask, task: { id, ...task } };
  }

  async update(id, newTask) {
    const { updated, value: task } = await this.tasks.update(id, newTask);
    return { updated, task };
  }

  async delete(id) {
    const { deleted } = await this.tasks.delete(id);
    return deleted;
  }

  ls() {
    return this.tasks.ls();
  }

  async unassignUser(userId) {
    // set userId of the deleted users' tasks to null
    const tasks = await this.tasks.where((task) => task?.userId === userId);

    tasks.forEach(async (task) => {
      const { id: taskId, ...updatedTask } = task;
      updatedTask.userId = null;
      await this.tasks.update(taskId, updatedTask);
    });
  }
}

module.exports = TaskRepo;

// __EOF__

// __EOF__
