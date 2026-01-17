/**
 * Safely access a deeply nested property in an object.
 *
 * Returns the value at the specified path, or the default value
 * if the path doesn't exist. Supports both dot notation and array syntax.
 *
 * @param obj - The source object to access
 * @param path - The path to the property (dot notation: 'a.b.c')
 * @param defaultValue - Value to return if path doesn't exist
 * @returns The value at path, or defaultValue if not found
 *
 * @example Basic usage
 * ```typescript
 * const user = { name: 'Ersin', address: { city: 'Istanbul' } };
 * get(user, 'address.city'); // 'Istanbul'
 * get(user, 'address.zip'); // undefined
 * get(user, 'address.zip', '00000'); // '00000'
 * ```
 *
 * @example With TypeScript inference
 * ```typescript
 * const user = { name: 'Ersin', age: 30 };
 * const name = get(user, 'name'); // TypeScript knows: string
 * const age = get(user, 'age'); // TypeScript knows: number
 * ```
 *
 * @example With array notation
 * ```typescript
 * const data = { items: [{ id: 1 }, { id: 2 }] };
 * get(data, 'items[0].id'); // 1
 * get(data, 'items[1].id'); // 2
 * ```
 *
 * @see {@link set} for setting properties
 * @see {@link has} for checking existence
 */
export function get<T, P extends string, D = undefined>(
  obj: T,
  path: P,
  defaultValue?: D
): any {
  if (obj == null) {
    return defaultValue;
  }

  const keys = path.toString().split(/[\.\[]/g).map((k) => k.replace(/[\]']/g, '')).filter(k => k !== '');
  let result: any = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  // Return default value if result is a function (treat functions as missing properties)
  if (typeof result === 'function') {
    return defaultValue;
  }

  return result ?? defaultValue;
}

/**
 * Immutable property setter.
 *
 * Creates a new object with the value at the specified path updated.
 * The original object is not modified.
 *
 * @param obj - The source object
 * @param path - The path to update (dot notation)
 * @param value - The value to set
 * @returns A new object with the updated value
 *
 * @example Basic usage
 * ```typescript
 * const user = { name: 'Ersin', age: 30 };
 * const updated = set(user, 'age', 31);
 * console.log(user.age); // 30 (unchanged)
 * console.log(updated.age); // 31
 * ```
 *
 * @example Nested path
 * ```typescript
 * const user = { profile: { name: 'Ersin' } };
 * const updated = set(user, 'profile.name', 'Ali');
 * console.log(updated.profile.name); // 'Ali'
 * ```
 *
 * @see {@link get} for getting properties
 * @see {@link setMut} for mutable version
 */
export function set<T, P extends string>(obj: T, path: P, value: any): T {
  if (obj == null || typeof obj !== 'object') {
    return obj;
  }

  const keys = path.toString().split('.');

  const deepSet = (current: any, keyIndex: number): any => {
    if (keyIndex === keys.length) {
      return value;
    }

    const key = keys[keyIndex];
    const isLast = keyIndex === keys.length - 1;

    if (isLast) {
      // Handle arrays with index notation
      const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayPath, index] = arrayMatch;
        const arrayIndex = parseInt(index, 10);
        const arrayValue = current?.[arrayPath];
        if (Array.isArray(arrayValue)) {
          return {
            ...current,
            [arrayPath]: [
              ...arrayValue.slice(0, arrayIndex),
              value,
              ...arrayValue.slice(arrayIndex + 1)
            ]
          };
        }
      }
      return { ...current, [key]: value };
    }

    const nextValue = current?.[key];
    const nestedObj = (nextValue != null && typeof nextValue === 'object') ? nextValue : {};
    return { ...current, [key]: deepSet(nestedObj, keyIndex + 1) };
  };

  return deepSet(obj, 0);
}

/**
 * Mutable property setter.
 *
 * Updates the value at the specified path by mutating the original object.
 * Use this only when mutation is intentional.
 *
 * @param obj - The source object (will be mutated)
 * @param path - The path to update (dot notation)
 * @param value - The value to set
 * @returns The modified object (same reference)
 *
 * @example Basic usage
 * ```typescript
 * const user = { name: 'Ersin', age: 30 };
 * setMut(user, 'age', 31);
 * console.log(user.age); // 31 (mutated)
 * ```
 *
 * @see {@link set} for immutable version
 */
export function setMut<T, P extends string>(obj: T, path: P, value: any): T {
  if (obj == null || typeof obj !== 'object') {
    return obj;
  }

  const keys = path.toString().split('.');
  let result: any = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (result[key] == null || typeof result[key] !== 'object') {
      result[key] = {};
    }
    result = result[key];
  }

  result[keys[keys.length - 1]] = value;
  return obj;
}

/**
 * Check if a path exists in an object.
 *
 * Returns true if the path resolves to a value that is not undefined.
 * For arrays, returns true even for out-of-bounds indices.
 *
 * @param obj - The source object
 * @param path - The path to check (dot notation)
 * @returns True if path exists
 *
 * @example Basic usage
 * ```typescript
 * const user = { name: 'Ersin', address: { city: 'Istanbul' } };
 * has(user, 'name'); // true
 * has(user, 'address.city'); // true
 * has(user, 'address.country'); // false
 * has(user, 'age'); // false
 * ```
 *
 * @see {@link get} for getting properties
 * @see {@link set} for setting properties
 */
export function has<T, P extends string>(obj: T, path: P): boolean {
  if (obj == null) {
    return false;
  }

  const keys = path.toString().split(/[\.\[]/g).map((k) => k.replace(/[\]']/g, '')).filter(k => k !== '');
  let result: any = obj;

  for (const key of keys) {
    // Check if this is an array index
    if (Array.isArray(result) && /^\d+$/.test(key)) {
      const index = parseInt(key, 10);
      // Return true for any index on an array (even out of bounds)
      // This matches lodash behavior
      return true;
    }
    if (result == null || !(key in result)) {
      return false;
    }
    result = result[key];
  }

  return result !== undefined;
}

/**
 * Create a new object with only the specified keys.
 *
 * @param obj - The source object
 * @param keys - Array of keys to pick
 * @returns New object with only specified keys
 *
 * @example Basic usage
 * ```typescript
 * const user = { name: 'Ersin', age: 30, city: 'Istanbul' };
 * pick(user, ['name', 'age']); // { name: 'Ersin', age: 30 }
 * ```
 *
 * @see {@link omit} for excluding keys
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Create a new object without the specified keys.
 *
 * @param obj - The source object
 * @param keys - Array of keys to omit
 * @returns New object without specified keys
 *
 * @example Basic usage
 * ```typescript
 * const user = { name: 'Ersin', age: 30, city: 'Istanbul' };
 * omit(user, ['age']); // { name: 'Ersin', city: 'Istanbul' }
 * ```
 *
 * @see {@link pick} for selecting keys
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };

  for (const key of keys) {
    delete (result as any)[key];
  }

  return result as Omit<T, K>;
}

/**
 * Safely merge objects together.
 *
 * Creates a new object with properties from all sources merged into target.
 * Prototype pollution protection: filters out __proto__, constructor, prototype.
 *
 * @param target - Target object
 * @param sources - Source objects to merge
 * @returns New merged object
 *
 * @example Basic usage
 * ```typescript
 * merge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }
 * merge({ a: 1 }, { a: 2 }); // { a: 2 } (later sources override)
 * merge({ a: 1 }, { b: 2 }, { c: 3 }); // { a: 1, b: 2, c: 3 }
 * ```
 *
 * @example Prototype pollution protection
 * ```typescript
 * merge({}, { __proto__: { evil: true } }); // {} - filtered!
 * merge({}, { constructor: { evil: true } }); // {} - filtered!
 * merge({}, { prototype: { evil: true } }); // {} - filtered!
 * ```
 */
export function merge<T extends object, S extends object>(
  target: T,
  ...sources: S[]
): T & S {
  const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

  const result = { ...target };

  for (const source of sources) {
    for (const key of Object.keys(source)) {
      if (DANGEROUS_KEYS.includes(key)) continue;
      (result as any)[key] = source[key as keyof S];
    }
  }

  return result as T & S;
}

/**
 * Type-safe Object.keys().
 *
 * Returns array of object's own enumerable property names with proper typing.
 *
 * @param obj - The source object
 * @returns Array of keys
 *
 * @example Basic usage
 * ```typescript
 * const user = { name: 'Ersin', age: 30 };
 * keys(user); // ['name', 'age'] (TypeScript knows these are 'name' | 'age')
 * ```
 *
 * @see {@link values} for getting values
 * @see {@link entries} for getting key-value pairs
 */
export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Type-safe Object.values().
 *
 * Returns array of object's own enumerable property values with proper typing.
 *
 * @param obj - The source object
 * @returns Array of values
 *
 * @example Basic usage
 * ```typescript
 * const user = { name: 'Ersin', age: 30 };
 * values(user); // ['Ersin', 30] (TypeScript knows these are string | number)
 * ```
 *
 * @see {@link keys} for getting keys
 * @see {@link entries} for getting key-value pairs
 */
export function values<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj) as Array<T[keyof T]>;
}

/**
 * Type-safe Object.entries().
 *
 * Returns array of object's own enumerable string-keyed property [key, value] pairs.
 *
 * @param obj - The source object
 * @returns Array of [key, value] tuples
 *
 * @example Basic usage
 * ```typescript
 * const user = { name: 'Ersin', age: 30 };
 * entries(user); // [['name', 'Ersin'], ['age', 30]]
 * ```
 *
 * @see {@link keys} for getting keys
 * @see {@link values} for getting values
 */
export function entries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Type-safe Object.fromEntries().
 *
 * Creates an object from key-value pairs.
 *
 * @param entries - Array of [key, value] tuples
 * @returns New object created from entries
 *
 * @example Basic usage
 * ```typescript
 * fromEntries([['a', 1], ['b', 2]]); // { a: 1, b: 2 }
 * ```
 *
 * @see {@link entries} for getting key-value pairs
 */
export function fromEntries<V>(
  entries: Iterable<[PropertyKey, V]>
): Record<string, V> {
  return Object.fromEntries(entries) as Record<string, V>;
}
