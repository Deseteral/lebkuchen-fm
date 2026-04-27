declare global {
  interface Math {
    clamp(value: number, min: number, max: number): number;
  }
}

// TODO: Remove this custom polyfill, when Math.clamp lands in JavaScript.
//       https://github.com/tc39/proposal-math-clamp
Math.clamp = function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
};

export {};
