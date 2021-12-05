// task.memory.repository.js

class TaskRepo {
  constructor(db) {
    this.db = db;
  }

  async create(task) {
    const id = await this.db.tasks.create(task);
    return { id, ...task };
  }

  async read(id) {
    const { hasValue: hasTask, value: task } = await this.db.tasks.read(id);
    return { hasTask, task: { id, ...task } };
  }

  async update(id, newTask) {
    const { updated, value: task } = await this.db.tasks.update(id, newTask);
    return { updated, task };
  }

  async delete(id) {
    const { deleted } = await this.db.tasks.delete(id);
    return deleted;
  }

  ls() {
    return this.db.tasks.ls();
  }
}

module.exports = TaskRepo;

// __EOF__

// __EOF__
