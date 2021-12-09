// storage.js

import * as uuid from 'uuid';

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
    return { key, value };
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
    const value = this.map.get(key);
    return { deleted: this.map.delete(key), value };
  }

  ls() {
    return [...this.map.entries()].map(([key, value]) => ({ key, value }));
  }

  where(pred) {
    const records = [];
    this.map.forEach((value, key) => {
      if (pred(value)) records.push({ key, value });
    });
    return records;
  }
}

export default Storage;

// __EOF__
