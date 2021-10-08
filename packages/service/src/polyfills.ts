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

declare global {
  interface Array<T> {
    last(): T,
    randomShuffle(): T[],
    isEmpty(): boolean,
  }
}

export {};
