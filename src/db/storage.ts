// storage.ts

/**
 * Simple in-memory key-value storage. The implementation is based on
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map | Map }.
 * The keys are generated externally and are presumed to be unique for each
 * individual object.
 *
 * In our application the string representation of a UUID will be used as the
 * key.
 *
 * TODO: apparently it's not very efficient to use string UUIDs as keys. However
 * for the sake of simplicity and the ability to use Map I've decided to keep
 * this solution for the time being.
 *
 * @public
 */
class Storage<KeyT, ValueT> {
  private map: Map<KeyT, ValueT>;

  /**
   * Storage constructor. Creates the instance of `Map` which will store the
   * objects keyed by their Ids.
   */
  constructor() {
    this.map = new Map();
  }

  /**
   * Add a new object to the storage. Put its **value** into the map using the
   * provided **key**.
   *
   * @param key - The key of the stored object (generated externally, supposed
   * to be unique).
   * @param value - The object stored in the map.
   *
   * @returns The `{ key, value }` pair of the added object (i.e. the same that
   * was passed in the arguments).
   */
  create(key: KeyT, value: ValueT) {
    this.map.set(key, value);
    return { key, value };
  }

  /**
   * Get the stored object by key.
   *
   * @param key - The key of the object to extract.
   *
   * @returns The pair `{ hasValue, value }`. If **hasValue** property is `true`
   * then **value** contains the extracted object. Otherwise **value** is
   * `undefined`.
   */
  read(key: KeyT) {
    const value = this.map.get(key);
    return { hasValue: !!value, value };
  }

  /**
   * Update the stored object with the provided key.
   *
   * @param key - The key of the object to extract
   * @param value - The object which will replace the one with the same key in
   * the map.
   *
   * @returns The pair `{ updated, value }`. If **updated** property is `true`
   * then **value** contains the same object passed in the same argument.
   * Otherwise **value** property is `undefined`.
   */
  update(key: KeyT, value: ValueT) {
    if (this.map.has(key)) {
      this.map.set(key, value);
      return { updated: true, value };
    }
    return { updated: false };
  }

  /**
   * Delete the stored object with the provided key.
   *
   * @param key - The key of the object to delete.
   *
   * @returns The pair `{ deleted, value }`. If **deleted** property is `true`
   * then **value** contains the object which has just been deleted. Otherwise
   * **value** is undefined.
   */
  delete(key: KeyT) {
    const value = this.map.get(key);
    return { deleted: this.map.delete(key), value };
  }

  /**
   * List all stored objects.
   *
   * @returns The array of `{ key, value }` pairs stored in the map.
   */
  ls() {
    return [...this.map.entries()].map(([key, value]) => ({ key, value }));
  }

  /**
   * Return the list of objects matching the filter.
   *
   * @param pred - The predicate function that returns `true` if the stored
   * object should be included and `false` otherwise.
   *
   * @returns The array of `{ key, value }` pairs stored in the map. Only the
   * **value**s for which **pred** returned `true` are included.
   */
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
