import { parseToSeconds } from '../utils';

describe('parseToSeconds', () => {
  [
    { given: '30', expected: 30 },
    { given: '1:30', expected: 90 },
    { given: '1:30:01', expected: 5401 },
    { given: '1:00:00', expected: 3600 },
    { given: '1:0:0', expected: 3600 },
    { given: '1:1:00', expected: 3660 },
    { given: '1:bla:01', expected: null },
    { given: 'bla:bla:01', expected: null },
    { given: '1:10120:00', expected: null },
    { given: '1:21:37:00', expected: null },
  ].forEach(({ given, expected }) => {
    it(`should return ${expected} seconds when ${given} is given`, () => {
      expect(parseToSeconds(given)).toBe(expected);
    });
  });
});
