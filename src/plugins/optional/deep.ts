import { DiffResult } from '../../types.js';

/**
 * Deep clone an object with circular reference support.
 *
 * Creates a deep copy of an object, handling circular references,
 * Date, RegExp, Map, Set, and other special types.
 *
 * @param obj - Object to clone
 * @returns Deep cloned object
 *
 * @example Basic usage
 * ```typescript
 * const obj = { a: 1, b: { c: 2 } };
 * const clone = cloneDeep(obj);
 * console.log(clone === obj); // false (different references)
 * console.log(clone.b === obj.b); // false (deep clone)
 * ```
 *
 * @example Circular reference handling
 * ```typescript
 * const obj = { a: 1 };
 * obj.self = obj; // circular!
 * const clone = cloneDeep(obj); // Works! No infinite loop
 * ```
 *
 * @example Special types
 * ```typescript
 * const obj = {
 *   date: new Date(),
 *   regex: /test/g,
 *   map: new Map([['key', 'value']]),
 *   set: new Set([1, 2, 3])
 * };
 * const clone = cloneDeep(obj);
 * console.log(clone.date instanceof Date); // true
 * console.log(clone.regex instanceof RegExp); // true
 * console.log(clone.map instanceof Map); // true
 * console.log(clone.set instanceof Set); // true
 * ```
 */
export function cloneDeep<T>(obj: T, seen = new WeakMap<object, any>()): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (seen.has(obj)) {
    return seen.get(obj);
  }

  if (obj instanceof Date) {
    const clone = new Date(obj.getTime());
    seen.set(obj, clone);
    return clone as T;
  }

  if (obj instanceof RegExp) {
    const clone = new RegExp(obj.source, obj.flags);
    seen.set(obj, clone);
    return clone as T;
  }

  if (obj instanceof Map) {
    const clone = new Map();
    seen.set(obj, clone);
    for (const [key, value] of obj) {
      clone.set(cloneDeep(key, seen), cloneDeep(value, seen));
    }
    return clone as T;
  }

  if (obj instanceof Set) {
    const clone = new Set();
    seen.set(obj, clone);
    for (const value of obj) {
      clone.add(cloneDeep(value, seen));
    }
    return clone as T;
  }

  if (Array.isArray(obj)) {
    const clone = [] as any;
    seen.set(obj, clone);
    for (let i = 0; i < obj.length; i++) {
      clone[i] = cloneDeep(obj[i], seen);
    }
    return clone;
  }

  const clone = {} as any;
  seen.set(obj, clone);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = cloneDeep(obj[key], seen);
    }
  }

  return clone;
}

/**
 * Deep merge objects with prototype pollution protection.
 *
 * Recursively merges sources into target, creating new objects for nested structures.
 * Prototype pollution protection: filters out __proto__, constructor, prototype.
 *
 * @param target - Target object
 * @param sources - Source objects to merge
 * @returns Deep merged object
 *
 * @example Basic usage
 * ```typescript
 * const target = { a: { b: 1, c: 1 } };
 * const source = { a: { b: 2, d: 2 }, e: 3 };
 * mergeDeep(target, source);
 * // { a: { b: 2, c: 1, d: 2 }, e: 3 }
 * ```
 *
 * @example Prototype pollution protection
 * ```typescript
 * mergeDeep({}, { a: { __proto__: { evil: true } } }); // { a: {} }
 * mergeDeep({}, { __proto__: { evil: true } }); // {}
 * ```
 *
 * @example Multiple sources
 * ```typescript
 * mergeDeep(
 *   { a: { b: 1 } },
 *   { a: { c: 2 } },
 *   { a: { d: 3 } }
 * );
 * // { a: { b: 1, c: 2, d: 3 } }
 * ```
 */
export function mergeDeep<T extends object>(target: T, ...sources: Partial<T>[]): T {
  const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

  const result = cloneDeep(target);

  for (const source of sources) {
    if (!source || typeof source !== 'object') continue;

    for (const key of Object.keys(source)) {
      if (DANGEROUS_KEYS.includes(key)) continue;

      const sourceValue = (source as any)[key];
      const targetValue = (result as any)[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        (result as any)[key] = mergeDeep(targetValue, sourceValue);
      } else {
        (result as any)[key] = cloneDeep(sourceValue);
      }
    }
  }

  return result;
}

/**
 * Deep equality comparison.
 *
 * Recursively compares two values for deep equality.
 * Handles objects, arrays, Date, RegExp, Map, Set, and primitives.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if values are deeply equal
 *
 * @example Primitives
 * ```typescript
 * isEqual(1, 1); // true
 * isEqual('hello', 'hello'); // true
 * isEqual(true, true); // true
 * isEqual(1, '1'); // false
 * ```
 *
 * @example Arrays
 * ```typescript
 * isEqual([1, 2, 3], [1, 2, 3]); // true
 * isEqual([1, 2, 3], [1, 2, 4]); // false
 * isEqual([1, [2, 3]], [1, [2, 3]]); // true
 * ```
 *
 * @example Objects
 * ```typescript
 * isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }); // true (order doesn't matter)
 * isEqual({ a: 1, b: 2 }, { a: 1, b: 3 }); // false
 * isEqual({ a: { b: 1 } }, { a: { b: 1 } }); // true
 * ```
 *
 * @example Special types
 * ```typescript
 * isEqual(new Date('2024-01-01'), new Date('2024-01-01')); // true
 * isEqual(/test/g, /test/g); // true
 * isEqual(new Set([1, 2]), new Set([1, 2])); // true
 * isEqual(new Map([['a', 1]]), new Map([['a', 1]])); // true
 * ```
 *
 * @example NaN handling
 * ```typescript
 * isEqual(NaN, NaN); // true
 * ```
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  // Handle NaN: NaN !== NaN, but we want them to be equal
  if (Number.isNaN(a) && Number.isNaN(b)) return true;

  if (a == null || b == null) return false;

  if (typeof a !== typeof b) return false;

  if (typeof a !== 'object') return false;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a) {
      if (!b.has(key) || !isEqual(value, b.get(key))) {
        return false;
      }
    }
    return true;
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const value of a) {
      if (!b.has(value)) {
        return false;
      }
    }
    return true;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (
        !Object.prototype.hasOwnProperty.call(b, key) ||
        !isEqual((a as any)[key], (b as any)[key])
      ) {
        return false;
      }
    }

    return true;
  }

  return false;
}

/**
 * Get differences between two objects.
 *
 * Compares two objects and returns a summary of changes.
 *
 * @param a - First object
 * @param b - Second object
 * @returns Diff result with changed, added, and removed properties
 *
 * @example Basic usage
 * ```typescript
 * diff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 });
 * // { changed: { b: { from: 2, to: 3 } }, added: { c: 4 }, removed: {} }
 * ```
 *
 * @example Complex object
 * ```typescript
 * diff(
 *   { user: { name: 'Alice', age: 30 } },
 *   { user: { name: 'Alice', age: 31 }, role: 'admin' }
 * );
 * // { changed: { user: { age: { from: 30, to: 31 } } }, added: { role: 'admin' }, removed: {} }
 * ```
 *
 * @example Removed properties
 * ```typescript
 * diff({ a: 1, b: 2, c: 3 }, { a: 1 });
 * // { changed: {}, added: {}, removed: { b: 2, c: 3 } }
 * ```
 */
export function diff<T extends object>(a: T, b: Partial<T>): DiffResult {
  const result: DiffResult = {
    changed: {},
    added: {},
    removed: {}
  };

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  const allKeys = Array.from(new Set([...keysA, ...keysB]));

  for (const key of allKeys) {
    const valueA = a[key as keyof T];
    const valueB = b[key as keyof T];

    const hasA = Object.prototype.hasOwnProperty.call(a, key);
    const hasB = Object.prototype.hasOwnProperty.call(b, key);

    if (!hasA && hasB) {
      (result.added as any)[key] = valueB;
    } else if (hasA && !hasB) {
      (result.removed as any)[key] = valueA;
    } else if (!isEqual(valueA, valueB)) {
      if (
        typeof valueA === 'object' &&
        valueA !== null &&
        typeof valueB === 'object' &&
        valueB !== null
      ) {
        const nestedDiff = diff(valueA as object, valueB as object);
        // For nested diffs, only include 'changed' property (not added/removed)
        const nestedChanged = nestedDiff.changed || {};
        if (Object.keys(nestedChanged).length > 0) {
          (result.changed as any)[key] = nestedChanged;
        }
      } else {
        (result.changed as any)[key] = { from: valueA, to: valueB };
      }
    }
  }

  return result;
}
