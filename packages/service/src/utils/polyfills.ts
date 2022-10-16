Array.prototype.last = function last<T>(): T { // eslint-disable-line no-extend-native
  return this[this.length - 1];
};

Array.prototype.randomShuffle = function randomShuffle<T>(): T[] { // eslint-disable-line no-extend-native
  this.sort(() => (0.5 - Math.random()));
  return this;
};

Array.prototype.isEmpty = function isEmpty(): boolean { // eslint-disable-line no-extend-native
  return this.length === 0;
};

Array.prototype.countOccurrences = function countOccurrences<T>(): Map<T, number> { // eslint-disable-line no-extend-native
  return this.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
};

Map.prototype.sort = function sort<K, V>(compareFn: (a: [K, V], b: [K, V]) => number): Map<K, V> { // eslint-disable-line no-extend-native
  return new Map([...this.entries()].sort(compareFn));
};

declare global {
  interface Array<T> {
    last(): T,
    randomShuffle(): T[],
    isEmpty(): boolean,
    countOccurrences(): Map<T, number>,
  }

  interface Map<K, V> {
    sort(compareFn: (a: [K, V], b: [K, V]) => number): Map<K, V>
  }
}

export {};
