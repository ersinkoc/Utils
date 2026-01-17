/**
 * Group array items by a key or function.
 *
 * Creates an object where keys are the result of grouping function
 * and values are arrays of items that belong to that group.
 *
 * @param arr - The array to group
 * @param key - Property name or grouping function
 * @returns Object with grouped items
 *
 * @example Group by property
 * ```typescript
 * const users = [
 *   { id: 1, name: 'Alice', role: 'admin' },
 *   { id: 2, name: 'Bob', role: 'user' },
 *   { id: 3, name: 'Charlie', role: 'user' }
 * ];
 * groupBy(users, 'role');
 * // { admin: [{ id: 1, name: 'Alice', role: 'admin' }],
 * //   user: [{ id: 2, name: 'Bob', role: 'user' }, { id: 3, name: 'Charlie', role: 'user' }] }
 * ```
 *
 * @example Group by function
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6];
 * groupBy(numbers, (n) => n % 2 === 0 ? 'even' : 'odd');
 * // { even: [2, 4, 6], odd: [1, 3, 5] }
 * ```
 *
 * @see {@link keyBy} for indexing by property
 */
export function groupBy<T, K extends keyof T>(
  arr: T[],
  key: K | ((item: T) => string)
): Record<string, T[]> {
  const result: Record<string, T[]> = {};

  for (const item of arr) {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }

  return result;
}

/**
 * Create an object keyed by a property value.
 *
 * Creates a lookup object where keys are property values and
 * values are the original array items.
 *
 * @param arr - The array to index
 * @param key - Property name or key function
 * @returns Object indexed by key
 *
 * @example Basic usage
 * ```typescript
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 3, name: 'Charlie' }
 * ];
 * keyBy(users, 'id');
 * // { 1: { id: 1, name: 'Alice' }, 2: { id: 2, name: 'Bob' }, 3: { id: 3, name: 'Charlie' } }
 * ```
 *
 * @example With function
 * ```typescript
 * const users = [{ id: 1 }, { id: 2 }];
 * keyBy(users, (u) => `user_${u.id}`);
 * // { user_1: { id: 1 }, user_2: { id: 2 } }
 * ```
 *
 * @see {@link groupBy} for grouping
 */
export function keyBy<T, K extends keyof T>(
  arr: T[],
  key: K | ((item: T) => string)
): Record<string, T> {
  const result: Record<string, T> = {};

  for (const item of arr) {
    const keyValue = typeof key === 'function' ? key(item) : String(item[key]);
    result[keyValue] = item;
  }

  return result;
}

/**
 * Split array into chunks of specified size.
 *
 * @param arr - The array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 *
 * @example Basic usage
 * ```typescript
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * chunk([1, 2, 3, 4, 5], 3); // [[1, 2, 3], [4, 5]]
 * ```
 *
 * @example Edge cases
 * ```typescript
 * chunk([1, 2, 3], 1); // [[1], [2], [3]]
 * chunk([1, 2, 3], 5); // [[1, 2, 3]]
 * ```
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

/**
 * Remove duplicate values from array (shallow comparison).
 *
 * @param arr - The array to deduplicate
 * @returns New array without duplicates
 *
 * @example Basic usage
 * ```typescript
 * uniq([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
 * uniq(['a', 'b', 'a', 'c']); // ['a', 'b', 'c']
 * ```
 *
 * @see {@link uniqBy} for key-based deduplication
 */
export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Remove duplicate values based on a key or function.
 *
 * @param arr - The array to deduplicate
 * @param key - Property name or key function
 * @returns New array without duplicates
 *
 * @example By property
 * ```typescript
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice Duplicate' }
 * ];
 * uniqBy(users, 'id');
 * // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * ```
 *
 * @example By function
 * ```typescript
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice Duplicate' }
 * ];
 * uniqBy(users, (u) => u.id);
 * // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 * ```
 *
 * @see {@link uniq} for simple deduplication
 */
export function uniqBy<T, K extends keyof T>(
  arr: T[],
  key: K | ((item: T) => string)
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of arr) {
    const keyValue = typeof key === 'function' ? key(item) : String(item[key]);
    if (!seen.has(keyValue)) {
      seen.add(keyValue);
      result.push(item);
    }
  }

  return result;
}

/**
 * Flatten nested arrays up to specified depth.
 *
 * @param arr - The array to flatten
 * @param depth - Maximum depth to flatten (default: 1)
 * @returns Flattened array
 *
 * @example Basic usage
 * ```typescript
 * flatten([[1, 2], [3, 4]]); // [1, 2, 3, 4]
 * flatten([[1, 2], [3, [4, 5]]]); // [1, 2, 3, [4, 5]]
 * ```
 *
 * @example With depth
 * ```typescript
 * flatten([[1, 2], [3, [4, 5]]], 2); // [1, 2, 3, 4, 5]
 * flatten([[[1, 2]], [[3, 4]]], 2); // [[1, 2], [3, 4]]
 * ```
 */
export function flatten<T>(arr: T[], depth = 1): any[] {
  const result: any[] = [];

  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }

  return result;
}

/**
 * Remove falsy values from array.
 *
 * Falsy values: false, 0, '', null, undefined, NaN
 *
 * @param arr - The array to compact
 * @returns New array without falsy values
 *
 * @example Basic usage
 * ```typescript
 * compact([0, 1, false, 2, '', 3, null, 4, undefined, 5, NaN, 6]);
 * // [1, 2, 3, 4, 5, 6]
 * ```
 */
export function compact<T>(arr: T[]): T[] {
  return arr.filter(Boolean) as T[];
}

/**
 * Get first n elements from array.
 *
 * @param arr - The source array
 * @param n - Number of elements to get (default: 1)
 * @returns First n elements, or single element if n=1
 *
 * @example Get first element
 * ```typescript
 * first([1, 2, 3]); // 1
 * ```
 *
 * @example Get first n elements
 * ```typescript
 * first([1, 2, 3, 4, 5], 3); // [1, 2, 3]
 * ```
 *
 * @example Edge cases
 * ```typescript
 * first([]); // undefined
 * first([1], 5); // [1]
 * ```
 *
 * @see {@link last} for getting last elements
 */
export function first<T>(arr: T[], n = 1): T | T[] | undefined {
  if (arr.length === 0) return undefined;
  if (n === 1) return arr[0];
  const result = arr.slice(0, n);
  return result.length === 1 ? result[0] : result as any;
}

/**
 * Get last n elements from array.
 *
 * @param arr - The source array
 * @param n - Number of elements to get (default: 1)
 * @returns Last n elements, or single element if n=1
 *
 * @example Get last element
 * ```typescript
 * last([1, 2, 3]); // 3
 * ```
 *
 * @example Get last n elements
 * ```typescript
 * last([1, 2, 3, 4, 5], 3); // [3, 4, 5]
 * ```
 *
 * @example Edge cases
 * ```typescript
 * last([]); // undefined
 * last([1], 5); // [1]
 * ```
 *
 * @see {@link first} for getting first elements
 */
export function last<T>(arr: T[], n = 1): T | T[] | undefined {
  if (arr.length === 0) return undefined;
  if (n === 1) return arr[arr.length - 1];
  return arr.slice(-n) as T[];
}

/**
 * Get a random sample from array.
 *
 * @param arr - The source array
 * @param n - Number of items to sample (default: 1)
 * @returns Random sample(s)
 *
 * @example Get one random element
 * ```typescript
 * const arr = [1, 2, 3, 4, 5];
 * sample(arr); // Random element (e.g., 3)
 * ```
 *
 * @example Get multiple random elements
 * ```typescript
 * const arr = [1, 2, 3, 4, 5];
 * sample(arr, 2); // Two random elements (e.g., [3, 1])
 * ```
 *
 * @example Edge cases
 * ```typescript
 * sample([]); // []
 * sample([1], 5); // [1]
 * ```
 */
export function sample<T>(arr: T[], n = 1): T[] {
  if (arr.length === 0) return [];
  if (n >= arr.length) return [...arr];

  const shuffled: T[] = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, n);
}
