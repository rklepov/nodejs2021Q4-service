// task.service.js

const HTTP_STATUS = require('http-status');

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
      p.code(HTTP_STATUS.NOT_FOUND).send({ id });
    }
  }

  async addTask(q, p) {
    const { boardId } = q.params;
    const task = { ...q.body, boardId };
    p.code(201).send(await this.repo.create(task));
  }

  async updateTask(q, p) {
    const { taskId: id } = q.params;
    const newTask = q.body;
    const { updated, task } = await this.repo.update(id, newTask);

    if (updated) {
      p.send(task);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ id });
    }
  }

  async deleteTask(q, p) {
    const { taskId: id } = q.params;

    if (await this.repo.delete(id)) {
      p.code(HTTP_STATUS.NO_CONTENT).send();
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ id });
    }
  }
}

module.exports = TaskService;

// __EOF__
