// task.service.js

const HTTP_STATUS = require('http-status');

const TaskRepo = require('./task.memory.repository');
const Task = require('./task.model');

class TaskService {
  constructor(tasks, boardService) {
    this.repo = new TaskRepo(tasks);
    this.boardService = boardService;
  }

  async getAll(q, p) {
    p.send(await this.repo.ls());
  }

  async getTask(q, p) {
    const { taskId } = q.params;
    const task = await this.repo.read(taskId);

    if (task) {
      p.send(task);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ taskId });
    }
  }

  async addTask(q, p) {
    const { boardId } = q.params;

    if (!(await this.boardService.boardExists(boardId))) {
      p.code(HTTP_STATUS.NOT_FOUND).send({ boardId });
      return;
    }

    const task = new Task({ ...q.body, boardId });
    p.code(HTTP_STATUS.CREATED).send(await this.repo.create(task));
  }

  async updateTask(q, p) {
    const { boardId, taskId } = q.params;

    if (!(await this.boardService.boardExists(boardId))) {
      p.code(HTTP_STATUS.NOT_FOUND).send({ boardId });
      return;
    }

    // TODO: check that the task with this Id is really assigned to the board

    let task = new Task({ ...q.body, boardId });
    task = await this.repo.update(taskId, task);

    if (task) {
      p.send(task);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ taskId });
    }
  }

  async deleteTask(q, p) {
    const { boardId, taskId } = q.params;

    if (!(await this.boardService.boardExists(boardId))) {
      p.code(HTTP_STATUS.NOT_FOUND).send({ boardId });
      return;
    }

    // TODO: check that the task with this Id is really assigned to the board

    if (await this.repo.delete(taskId)) {
      p.code(HTTP_STATUS.NO_CONTENT).send();
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ taskId });
    }
  }

  async unassignUser(userId) {
    // set userId of the deleted users' tasks to null
    const tasks = await this.repo.getTasksFor(
      (task) => task?.userId === userId
    );

    tasks.forEach(async (task) => {
      const updatedTask = new Task(task);
      updatedTask.userId = null;
      await this.repo.update(task.id, updatedTask);
    });
  }

  async deleteTasksFor(boardId) {
    const tasks = await this.repo.getTasksFor(
      (task) => task?.boardId === boardId
    );

    tasks.forEach(async (task) => {
      await this.repo.delete(task.id);
    });
  }
}

module.exports = TaskService;

// __EOF__
