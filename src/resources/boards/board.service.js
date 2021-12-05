// board.service.js

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
      p.code(404).send({ id });
    }
  }

  async addBoard(q, p) {
    const { title, columns } = q.body;
    p.code(201).send(await this.repo.create({ title }, columns));
  }

  async updateBoard(q, p) {
    const { boardId: id } = q.params;
    const { title, columns } = q.body;
    const { updated, board } = await this.repo.update(id, { title }, columns);

    if (updated) {
      p.send(board);
    } else {
      p.code(404).send({ id });
    }
  }

  async deleteBoard(q, p) {
    const { boardId: id } = q.params;

    if (await this.repo.delete(id)) {
      p.code(204).send();
    } else {
      p.code(404).send({ id });
    }
  }
}

module.exports = BoardService;

// __EOF__
