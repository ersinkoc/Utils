import { describe, it, expect } from '@jest/globals';
import { cloneDeep, mergeDeep, isEqual, diff } from '../src/plugins/optional/deep.js';

describe('Deep Utilities', () => {
  describe('cloneDeep', () => {
    it('should deep clone object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = cloneDeep(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.b).not.toBe(obj.b);
    });

    it('should handle circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      const clone = cloneDeep(obj);
      expect(clone.a).toBe(1);
      expect(clone.self).toBe(clone);
    });

    it('should clone Date', () => {
      const date = new Date('2024-01-01');
      const clone = cloneDeep({ date });
      expect(clone.date).toEqual(date);
      expect(clone.date).not.toBe(date);
      expect(clone.date instanceof Date).toBe(true);
    });

    it('should clone RegExp', () => {
      const regex = /test/g;
      const clone = cloneDeep({ regex });
      expect(clone.regex).toEqual(regex);
      expect(clone.regex).not.toBe(regex);
      expect(clone.regex instanceof RegExp).toBe(true);
    });

    it('should clone Map', () => {
      const map = new Map([['key', 'value']]);
      const clone = cloneDeep({ map });
      expect(clone.map).toEqual(map);
      expect(clone.map).not.toBe(map);
      expect(clone.map instanceof Map).toBe(true);
    });

    it('should clone Set', () => {
      const set = new Set([1, 2, 3]);
      const clone = cloneDeep({ set });
      expect(clone.set).toEqual(set);
      expect(clone.set).not.toBe(set);
      expect(clone.set instanceof Set).toBe(true);
    });

    it('should clone array', () => {
      const arr = [1, [2, 3]];
      const clone = cloneDeep(arr);
      expect(clone).toEqual(arr);
      expect(clone).not.toBe(arr);
      expect(clone[1]).not.toBe(arr[1]);
    });

    it('should handle primitives', () => {
      expect(cloneDeep(null)).toBeNull();
      expect(cloneDeep(42)).toBe(42);
      expect(cloneDeep('test')).toBe('test');
      expect(cloneDeep(true)).toBe(true);
    });
  });

  describe('mergeDeep', () => {
    it('should deep merge objects', () => {
      const target = { a: { b: 1, c: 1 } };
      const source = { a: { b: 2, d: 2 }, e: 3 };
      const result = mergeDeep(target, source);
      expect(result).toEqual({ a: { b: 2, c: 1, d: 2 }, e: 3 });
    });

    it('should filter prototype pollution keys', () => {
      expect(mergeDeep({}, { a: { __proto__: { evil: true } } } as any)).toEqual({
        a: {},
      });
      expect(mergeDeep({}, { __proto__: { evil: true } } as any)).toEqual({});
    });

    it('should handle multiple sources', () => {
      const result = mergeDeep({ a: { b: 1 } }, { a: { c: 2 } }, { a: { d: 3 } });
      expect(result).toEqual({ a: { b: 1, c: 2, d: 3 } });
    });

    it('should not mutate target', () => {
      const target = { a: 1 };
      const result = mergeDeep(target, { b: 2 });
      expect(target).toEqual({ a: 1 });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('isEqual', () => {
    it('should compare primitives', () => {
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual('hello', 'hello')).toBe(true);
      expect(isEqual(true, true)).toBe(true);
      expect(isEqual(1, '1')).toBe(false);
    });

    it('should handle NaN equality', () => {
      expect(isEqual(NaN, NaN)).toBe(true);
    });

    it('should compare arrays', () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    });

    it('should compare objects (order independent)', () => {
      expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
      expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
      expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
      // Different property values
      expect(isEqual({ a: { x: 1 } }, { a: { x: 2 } })).toBe(false);
      // Property exists in a but not in b
      expect(isEqual({ a: 1 }, {})).toBe(false);
      // Nested object with different values
      expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false);
      // Property exists in b but not in a (different key count)
      expect(isEqual({}, { a: 1 })).toBe(false);
      // Deep nested inequality
      expect(isEqual({ a: { b: { c: { d: 1 } } } }, { a: { b: { c: { d: 2 } } } })).toBe(false);
    });

    it('should compare Date', () => {
      expect(isEqual(new Date('2024-01-01'), new Date('2024-01-01'))).toBe(true);
      expect(isEqual(new Date('2024-01-01'), new Date('2024-01-02'))).toBe(false);
    });

    it('should compare RegExp', () => {
      expect(isEqual(/test/g, /test/g)).toBe(true);
      expect(isEqual(/test/g, /test/i)).toBe(false);
    });

    it('should compare Map', () => {
      expect(isEqual(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true);
      expect(isEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false);
    });

    it('should compare Set', () => {
      expect(isEqual(new Set([1, 2]), new Set([1, 2]))).toBe(true);
      expect(isEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false);
      // Empty sets are equal
      expect(isEqual(new Set(), new Set())).toBe(true);
      // Sets with same values in different order
      expect(isEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
    });
  });

  describe('diff', () => {
    it('should detect changed values', () => {
      const result = diff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 });
      expect(result).toEqual({
        changed: { b: { from: 2, to: 3 } },
        added: { c: 4 },
        removed: {},
      });
    });

    it('should detect nested changes', () => {
      const result = diff(
        { user: { name: 'Alice', age: 30 } },
        { user: { name: 'Alice', age: 31 }, role: 'admin' }
      );
      expect(result).toEqual({
        changed: { user: { age: { from: 30, to: 31 } } },
        added: { role: 'admin' },
        removed: {},
      });
    });

    it('should detect removed properties', () => {
      const result = diff({ a: 1, b: 2, c: 3 }, { a: 1 });
      expect(result).toEqual({
        changed: {},
        added: {},
        removed: { b: 2, c: 3 },
      });
    });

    it('should handle identical objects', () => {
      const result = diff({ a: 1, b: 2 }, { a: 1, b: 2 });
      expect(result).toEqual({
        changed: {},
        added: {},
        removed: {},
      });
    });
  });
});
