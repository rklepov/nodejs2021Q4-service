// board.service.js

const HTTP_STATUS = require('http-status');

class BoardService {
  constructor(repo) {
    this.repo = repo;
  }

  async getAll(q, p) {
    p.send(await this.repo.ls());
  }

  async getBoard(q, p) {
    const { boardId: id } = q.params;
    const { hasBoard, board } = await this.repo.read(id);

    if (hasBoard) {
      p.send(board);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ id });
    }
  }

  async addBoard(q, p) {
    const { title, columns } = q.body;
    p.code(HTTP_STATUS.CREATED).send(
      await this.repo.create({ title }, columns)
    );
  }

  async updateBoard(q, p) {
    const { boardId: id } = q.params;
    const { title, columns } = q.body;
    const { updated, board } = await this.repo.update(id, { title }, columns);

    if (updated) {
      p.send(board);
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ id });
    }
  }

  async deleteBoard(q, p) {
    const { boardId: id } = q.params;

    if (await this.repo.delete(id)) {
      p.code(HTTP_STATUS.NO_CONTENT).send();
    } else {
      p.code(HTTP_STATUS.NOT_FOUND).send({ id });
    }
  }
}

module.exports = BoardService;

// __EOF__
