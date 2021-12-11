// table.js

const Storage = require('./storage.js');

/**
 * The abstraction of a database table.
 * Simple implementation adds async interface to  in-memory key-value storage with.
 */
class Table {
  constructor() {
    this.storage = new Storage();
  }

  create(value) {
    return new Promise((resolve) => {
      resolve(this.storage.create(value));
    });
  }

  read(key) {
    return new Promise((resolve) => {
      resolve(this.storage.read(key));
    });
  }

  update(key, value) {
    return new Promise((resolve) => {
      resolve(this.storage.update(key, value));
    });
  }

  delete(key) {
    return new Promise((resolve) => {
      resolve(this.storage.delete(key));
    });
  }

  ls() {
    return new Promise((resolve) => {
      resolve(this.storage.ls());
    });
  }

  where(pred) {
    return new Promise((resolve) => {
      resolve(this.storage.where(pred));
    });
  }
}

module.exports = Table;

// __EOF__
