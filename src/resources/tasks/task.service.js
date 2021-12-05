// task.service.js

class TaskService {
  constructor(repo) {
    this.repo = repo;
  }

  async getAll(q, p) {
    p.send(await this.repo.ls());
  }

  async getTask(q, p) {
    const { taskId: id } = q.params;
    const { hasTask, task } = await this.repo.read(id);

    if (hasTask) {
      p.send(task);
    } else {
      p.code(404).send({ id });
    }
  }

  async addTask(q, p) {
    const task = q.body;
    p.code(201).send(await this.repo.create(task));
  }

  async updateTask(q, p) {
    const { taskId: id } = q.params;
    const newTask = q.body;
    const { updated, task } = await this.repo.update(id, newTask);

    if (updated) {
      p.send(task);
    } else {
      p.code(404).send({ id });
    }
  }

  async deleteTask(q, p) {
    const { taskId: id } = q.params;

    if (await this.repo.delete(id)) {
      p.code(204).send();
    } else {
      p.code(404).send({ id });
    }
  }
}

module.exports = TaskService;

// __EOF__
