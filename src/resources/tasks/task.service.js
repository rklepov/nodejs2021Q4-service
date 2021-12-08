// task.service.js

const HTTP_STATUS = require('http-status');

const { Reply } = require('../../common/reply');

const TaskRepo = require('./task.memory.repository');
const Task = require('./task.model');

class TaskService {
  constructor(tasks, boardService) {
    this.repo = new TaskRepo(tasks);
    this.boardService = boardService;
  }

  async getAll() {
    return Reply(HTTP_STATUS.OK, await this.repo.ls());
  }

  async getTask({ params }) {
    const { taskId } = params;
    const task = await this.repo.read(taskId);

    if (task) {
      return Reply(HTTP_STATUS.OK, task);
    }
    return Reply(HTTP_STATUS.NOT_FOUND, { taskId });
  }

  async addTask({ params, body }) {
    const { boardId } = params;

    if (!(await this.boardService.boardExists(boardId))) {
      return Reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    const task = new Task({ ...body, boardId });
    return Reply(HTTP_STATUS.CREATED, await this.repo.create(task));
  }

  async updateTask({ params, body }) {
    const { boardId, taskId } = params;

    if (!(await this.boardService.boardExists(boardId))) {
      return Reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    // TODO: check that the task with this Id is really assigned to the board

    let task = new Task({ ...body, boardId });
    task = await this.repo.update(taskId, task);

    if (task) {
      return Reply(HTTP_STATUS.OK, task);
    }
    return Reply(HTTP_STATUS.NOT_FOUND, { taskId });
  }

  async deleteTask({ params }) {
    const { boardId, taskId } = params;

    if (!(await this.boardService.boardExists(boardId))) {
      return Reply(HTTP_STATUS.NOT_FOUND, { boardId });
    }

    // TODO: check that the task with this Id is really assigned to the board

    if (await this.repo.delete(taskId)) {
      return Reply(HTTP_STATUS.NO_CONTENT);
    }
    return Reply(HTTP_STATUS.NOT_FOUND, { taskId });
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
