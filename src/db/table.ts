// table.ts

import Storage from './storage';

// TODO: preferably should be "the return type of uuid.v4()" rather than tha
//       hardcoded primitive type.
//       Also this should be some global definition somewhere.
type KeyT = string;

/**
 * The abstraction of a database table.
 * Simple implementation adds async interface to  in-memory key-value storage with.
 *
 *  TODO: review the definitions of Promise return types, can be simplified?
 */
class Table<ValueT> {
  storage: Storage<ValueT>;

  constructor() {
    this.storage = new Storage<ValueT>();
  }

  create(value: ValueT) {
    return new Promise<{
      key: KeyT;
      value: ValueT;
    }>((resolve) => {
      resolve(this.storage.create(value));
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
