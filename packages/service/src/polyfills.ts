Array.prototype.last = function last<T>(): T { // eslint-disable-line no-extend-native
  return this[this.length - 1];
};

declare global {
  interface Array<T> {
    last(): T,
  }
}

export {};
