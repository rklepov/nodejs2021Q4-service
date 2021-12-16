// table.ts

import Storage from './storage';

/**
 * The abstraction of a database table.
 * Simple implementation adds async interface to  in-memory key-value storage with.
 *
 *  TODO: review the definitions of Promise return types, can be simplified?
 */
class Table<KeyT, ValueT> {
  storage: Storage<KeyT, ValueT>;

  constructor() {
    this.storage = new Storage();
  }

  create(key: KeyT, value: ValueT) {
    return new Promise<{
      key: KeyT;
      value: ValueT;
    }>((resolve) => {
      resolve(this.storage.create(key, value));
    });
  }

  read(key: KeyT) {
    return new Promise<{
      hasValue: boolean;
      value?: ValueT | undefined;
    }>((resolve) => {
      resolve(this.storage.read(key));
    });
  }

  update(key: KeyT, value: ValueT) {
    return new Promise<{
      updated: boolean;
      value?: ValueT | undefined;
    }>((resolve) => {
      resolve(this.storage.update(key, value));
    });
  }

  delete(key: KeyT) {
    return new Promise<{
      deleted: boolean;
      value?: ValueT | undefined;
    }>((resolve) => {
      resolve(this.storage.delete(key));
    });
  }

  ls() {
    return new Promise<
      {
        key: KeyT;
        value: ValueT;
      }[]
    >((resolve) => {
      resolve(this.storage.ls());
    });
  }

  where(pred: (v: ValueT) => boolean) {
    return new Promise<
      {
        key: KeyT;
        value: ValueT;
      }[]
    >((resolve) => {
      resolve(this.storage.where(pred));
    });
  }
}

export default Table;

// __EOF__
