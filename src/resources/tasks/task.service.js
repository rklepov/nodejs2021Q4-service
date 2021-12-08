// task.service.js

const HTTP_STATUS = require('http-status');
const TaskRepo = require('./task.memory.repository');

class TaskService {
  constructor(tasks) {
    this.repo = new TaskRepo(tasks);
  }

  async getAll(q, p) {
    p.send(await this.repo.ls());
  }

  async getTask(q, p) {
    const { taskId } = q.params;
    const { hasTask, task } = await this.repo.read(taskId);

    if (hasTask) {
      p.send(task);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ taskId });
    }
  }

  async addTask(q, p) {
    const { boardId } = q.params;
    const task = { ...q.body, boardId };
    p.code(201).send(await this.repo.create(task));
  }

  async updateTask(q, p) {
    const { taskId } = q.params;
    const newTask = q.body;
    const { updated, task } = await this.repo.update(taskId, newTask);

    if (updated) {
      p.send(task);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ taskId });
    }
  }

  async deleteTask(q, p) {
    const { taskId } = q.params;

    if (await this.repo.delete(taskId)) {
      p.code(HTTP_STATUS.NO_CONTENT).send();
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ taskId });
    }
  }

  async unassignUser(userId) {
    await this.repo.unassignUser(userId);
  }
}

module.exports = TaskService;

// __EOF__
