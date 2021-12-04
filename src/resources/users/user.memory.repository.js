// user.memory.repository.js

class UserRepo {
  constructor(db) {
    this.db = db;
  }

  create(user) {
    return this.db.users.create(user);
  }

  read(id) {
    const res = this.db.users.read(id);
    return res;
  }

  update(id, user) {
    return this.db.users.update(id, user);
  }

  delete(id) {
    return this.db.users.delete(id);
  }

  ls() {
    return this.db.users.ls();
  }

  where(pred) {
    return this.db.users.where(pred);
  }
}

module.exports = UserRepo;

// __EOF__
