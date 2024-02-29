String.prototype.truncated = function truncated(limit: number, useWordBoundary: Boolean): string { // eslint-disable-line no-extend-native
  if (this.length <= limit) { return String(this); }
  const subString = this.slice(0, limit - 1);
  return `${useWordBoundary
    ? subString.slice(0, subString.lastIndexOf(' '))
    : subString}…`;
};

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

Array.prototype.unique = function unique<T>(): T[] { // eslint-disable-line no-extend-native
  return Array.from(new Set(this));
};

declare global {
  interface Array<T> {
    last(): T,
    randomShuffle(): T[],
    isEmpty(): boolean,
    countOccurrences(): Map<T, number>,
    unique(): T[],
  }

  interface String {
    truncated(limit: number, useWordBoundary: Boolean): string,
  }
}

export {};
