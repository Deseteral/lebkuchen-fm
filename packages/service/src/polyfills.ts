Array.prototype.last = function last<T>(): T { // eslint-disable-line no-extend-native
  return this[this.length - 1];
};

Array.prototype.randomShuffle = function randomShuffle<T>(): T[] { // eslint-disable-line no-extend-native
  this.sort(() => (0.5 - Math.random()));
  return this;
};

declare global {
  interface Array<T> {
    last(): T,
    randomShuffle(): T[],
  }
}

export {};
