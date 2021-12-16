// storage.ts

/**
 * Simple in-memory key-value storage. The implementation is based on Map which
 * keys are string representations of UUID.
 *
 * TODO: apparently it's not very efficient to use string UUIDs as keys. However
 * for the sake of simplicity and the ability to use Map I've decided to
 * keep this solution for the time being.
 */
class Storage<KeyT, ValueT> {
  map: Map<KeyT, ValueT>;

  constructor() {
    this.map = new Map();
  }

  create(key: KeyT, value: ValueT) {
    this.map.set(key, value);
    return { key, value };
  }

  read(key: KeyT) {
    const value = this.map.get(key);
    return { hasValue: !!value, value };
  }

  update(key: KeyT, value: ValueT) {
    if (this.map.has(key)) {
      this.map.set(key, value);
      return { updated: true, value };
    }
    return { updated: false };
  }

  delete(key: KeyT) {
    const value = this.map.get(key);
    return { deleted: this.map.delete(key), value };
  }

  ls() {
    return [...this.map.entries()].map(([key, value]) => ({ key, value }));
  }

  where(pred: (v: ValueT) => boolean) {
    const records: { key: KeyT; value: ValueT }[] = [];
    this.map.forEach((value: ValueT, key: KeyT) => {
      if (pred(value)) records.push({ key, value });
    });
    return records;
  }
}

export default Storage;

// __EOF__
