// table.ts

import Storage from './storage';

/**
 * The abstraction of a database table.  This simple implementation just adds
 * async interface to  in-memory key-value storage defined in {@link Storage | Storage class}
 *
 * TODO: review the definitions of Promise return types, can be simplified?
 */
class Table<KeyT, ValueT> {
  private storage: Storage<KeyT, ValueT>;

  /**
   * Table constructor. Create the storage object which is responsible for
   * actually keeping the objects and assigns it to the private property.
   */
  constructor() {
    this.storage = new Storage();
  }

  /**
   * Asynchronously add a new object to the storage. Put its **value** into the
   * map using the provided **key**.
   *
   * @param key - The key of the stored object (generated externally, supposed
   * to be unique).
   * @param value - The object stored in the map.
   *
   * @returns A Promise that will resolve to the `{ key, value }` pair of the
   * added object.
   *
   * @see {@link Storage.create}
   */
  create(key: KeyT, value: ValueT) {
    return new Promise<{
      key: KeyT;
      value: ValueT;
    }>((resolve) => {
      resolve(this.storage.create(key, value));
    });
  }

  /**
   * Asynchronously get the stored object by key.
   *
   * @param key - The key of the object to extract.
   *
   * @returns A Promise that will resolve to the pair `{ hasValue, value }`. If
   * **hasValue** property is `true` then **value** contains the extracted
   * object. Otherwise **value** is `undefined`.
   *
   * @see {@link Storage.read}
   */
  read(key: KeyT) {
    return new Promise<{
      hasValue: boolean;
      value?: ValueT | undefined;
    }>((resolve) => {
      resolve(this.storage.read(key));
    });
  }

  /**
   * Asynchronously update the stored object with the provided key.
   *
   * @param key - The key of the object to extract
   * @param value - The object which will replace the one with the same key in
   * the map.
   *
   * @returns A Promise that will resolve to the pair `{ updated, value }`. If
   * **updated** property is `true` then **value** contains the same object
   * passed in the same argument.  Otherwise **value** property is `undefined`.
   *
   * @see {@link Storage.update}
   */
  update(key: KeyT, value: ValueT) {
    return new Promise<{
      updated: boolean;
      value?: ValueT | undefined;
    }>((resolve) => {
      resolve(this.storage.update(key, value));
    });
  }

  /**
   * Asynchronously delete the stored object with the provided key.
   *
   * @param key - The key of the object to delete.
   *
   * @returns A Promise that will resolve to the pair `{ deleted, value }`. If
   * **deleted** property is `true` then **value** contains the object which has
   * just been deleted. Otherwise **value** is undefined.
   *
   * @see {@link Storage.delete}
   */
  delete(key: KeyT) {
    return new Promise<{
      deleted: boolean;
      value?: ValueT | undefined;
    }>((resolve) => {
      resolve(this.storage.delete(key));
    });
  }

  /**
   * Asynchronously list all stored objects.
   *
   * @returns A Promise that will resolve to the array of `{ key, value }` pairs
   * stored in the map.
   *
   * @see {@link Storage.ls}
   */
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

  /**
   * Asynchronously return the list of objects matching the filter.
   *
   * @param pred - The predicate function that returns `true` if the stored
   * object should be included and `false` otherwise.
   *
   * @returns A Promise that will resolve to the array of `{ key, value }` pairs
   * stored in the map. Only the **value**s for which **pred** returned `true`
   * are included.
   *
   * @see {@link Storage.where}
   */
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
