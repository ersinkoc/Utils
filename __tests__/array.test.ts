import { describe, it, expect } from '@jest/globals';
import {
  groupBy,
  keyBy,
  chunk,
  uniq,
  uniqBy,
  flatten,
  compact,
  first,
  last,
  sample,
} from '../src/plugins/core/array.js';

describe('Array Utilities', () => {
  describe('groupBy', () => {
    it('should group array items by property key', () => {
      const users = [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
        { id: 3, name: 'Charlie', role: 'user' },
      ];
      const result = groupBy(users, 'role');
      expect(result).toEqual({
        admin: [{ id: 1, name: 'Alice', role: 'admin' }],
        user: [
          { id: 2, name: 'Bob', role: 'user' },
          { id: 3, name: 'Charlie', role: 'user' },
        ],
      });
    });

    it('should group array items by function', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const result = groupBy(numbers, (n) => (n % 2 === 0 ? 'even' : 'odd'));
      expect(result).toEqual({
        even: [2, 4, 6],
        odd: [1, 3, 5],
      });
    });

    it('should handle empty array', () => {
      expect(groupBy([], 'key')).toEqual({});
    });
  });

  describe('keyBy', () => {
    it('should create object keyed by property value', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];
      const result = keyBy(users, 'id');
      expect(result).toEqual({
        '1': { id: 1, name: 'Alice' },
        '2': { id: 2, name: 'Bob' },
        '3': { id: 3, name: 'Charlie' },
      });
    });

    it('should work with function', () => {
      const users = [{ id: 1 }, { id: 2 }];
      const result = keyBy(users, (u) => `user_${u.id}`);
      expect(result).toEqual({
        user_1: { id: 1 },
        user_2: { id: 2 },
      });
    });

    it('should handle empty array', () => {
      expect(keyBy([], 'id')).toEqual({});
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([
        [1, 2],
        [3, 4],
        [5],
      ]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    it('should handle chunk size of 1', () => {
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });

    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });
  });

  describe('uniq', () => {
    it('should remove duplicate values', () => {
      expect(uniq([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('should handle strings', () => {
      expect(uniq(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty array', () => {
      expect(uniq([])).toEqual([]);
    });
  });

  describe('uniqBy', () => {
    it('should remove duplicates by property', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice Duplicate' },
      ];
      const result = uniqBy(users, 'id');
      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
    });

    it('should work with function', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice Duplicate' },
      ];
      const result = uniqBy(users, (u) => u.id);
      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays one level', () => {
      expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
    });

    it('should flatten with depth parameter', () => {
      expect(flatten([[1, 2], [3, [4, 5]]], 2)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle empty arrays', () => {
      expect(flatten([[], []])).toEqual([]);
    });
  });

  describe('compact', () => {
    it('should remove falsy values', () => {
      expect(compact([0, 1, false, 2, '', 3, null, 4, undefined, 5, NaN, 6])).toEqual([
        1, 2, 3, 4, 5, 6,
      ]);
    });

    it('should handle empty array', () => {
      expect(compact([])).toEqual([]);
    });
  });

  describe('first', () => {
    it('should get first element', () => {
      expect(first([1, 2, 3])).toBe(1);
    });

    it('should get first n elements', () => {
      expect(first([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3]);
    });

    it('should return undefined for empty array', () => {
      expect(first([])).toBeUndefined();
    });

    it('should handle n larger than array length', () => {
      // When result has only 1 element, returns single element (not array)
      expect(first([1], 5)).toBe(1);
    });
  });

  describe('last', () => {
    it('should get last element', () => {
      expect(last([1, 2, 3])).toBe(3);
    });

    it('should get last n elements', () => {
      expect(last([1, 2, 3, 4, 5], 3)).toEqual([3, 4, 5]);
    });

    it('should return undefined for empty array', () => {
      expect(last([])).toBeUndefined();
    });

    it('should handle n larger than array length', () => {
      expect(last([1], 5)).toEqual([1]);
    });
  });

  describe('sample', () => {
    it('should return one random element', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = sample(arr);
      expect(arr).toContain(result[0]);
      expect(result).toHaveLength(1);
    });

    it('should return multiple random elements', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = sample(arr, 2);
      expect(result).toHaveLength(2);
      result.forEach((item) => {
        expect(arr).toContain(item);
      });
    });

    it('should return empty array for empty input', () => {
      expect(sample([])).toEqual([]);
    });

    it('should return full array when n >= array length', () => {
      const arr = [1, 2, 3];
      const result = sample(arr, 5);
      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining(arr));
    });
  });
});
