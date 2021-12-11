// storage.js

const uuid = require('uuid');

/**
 * Simple in-memory key-value storage. The implementation is based on Map which
 * keys are string representations of UUID.
 *
 * TODO: apparently it's not very efficient to use string UUIDs as keys. However
 * for the sake of simplicity and the ability to use Map I've decided to
 * keep this solution for the time being.
 */
class Storage {
  constructor() {
    this.map = new Map();
  }

  create(value) {
    const key = uuid.v4();
    this.map.set(key, value);
    return key;
  }

  read(key) {
    const value = this.map.get(key);
    return { hasValue: !!value, value };
  }

  update(key, value) {
    if (this.map.has(key)) {
      this.map.set(key, value);
      return { updated: true, value };
    }
    return { updated: false };
  }

  delete(key) {
    return { deleted: this.map.delete(key) };
  }

  ls() {
    return [...this.map.entries()].map(([id, v]) => ({ id, ...v }));
  }

  where(pred) {
    const records = [];
    this.map.forEach((v, id) => {
      if (pred(v)) records.push({ id, ...v });
    });
    return records;
  }
}

module.exports = Storage;

// __EOF__
