// storage.ts

import * as uuid from 'uuid';

type K = string;

/**
 * Simple in-memory key-value storage. The implementation is based on Map which
 * keys are string representations of UUID.
 *
 * TODO: apparently it's not very efficient to use string UUIDs as keys. However
 * for the sake of simplicity and the ability to use Map I've decided to
 * keep this solution for the time being.
 */
class Storage<V> {
  map: Map<K, V>;

  constructor() {
    this.map = new Map();
  }

  create(value: V) {
    const key = uuid.v4();

    this.map.set(key, value);
    return { key, value };
  }

  read(key: string) {
    const value = this.map.get(key);
    return { hasValue: !!value, value };
  }

  update(key: string, value: V) {
    if (this.map.has(key)) {
      this.map.set(key, value);
      return { updated: true, value };
    }
    return { updated: false };
  }

  delete(key: string) {
    const value = this.map.get(key);
    return { deleted: this.map.delete(key), value };
  }

  ls() {
    return [...this.map.entries()].map(([key, value]) => ({ key, value }));
  }

  where(pred: (v: V) => boolean) {
    const records: { key: K; value: V }[] = [];
    this.map.forEach((value: V, key: K) => {
      if (pred(value)) records.push({ key, value });
    });
    return records;
  }
}

export default Storage;

// __EOF__
