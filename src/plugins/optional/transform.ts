/**
 * Transform object keys with a function.
 *
 * Creates a new object with keys transformed by the provided function.
 *
 * @param obj - Source object
 * @param fn - Function to transform keys
 * @returns New object with transformed keys
 *
 * @example Basic usage
 * ```typescript
 * mapKeys({ a: 1, b: 2 }, (key) => key.toUpperCase());
 * // { A: 1, B: 2 }
 * ```
 *
 * @example Adding prefix
 * ```typescript
 * mapKeys({ name: 'Alice', age: 30 }, (key) => `user_${key}`);
 * // { user_name: 'Alice', user_age: 30 }
 * ```
 *
 * @example Snake case conversion
 * ```typescript
 * mapKeys({ firstName: 'Alice', lastName: 'Smith' }, (key) => snakeCase(key));
 * // { first_name: 'Alice', last_name: 'Smith' }
 * ```
 *
 * @see {@link mapValues} for transforming values
 */
export function mapKeys<T extends object, K extends PropertyKey>(
  obj: T,
  fn: (key: keyof T, value: T[keyof T]) => K
): Record<K, T[keyof T]> {
  const result = {} as Record<K, T[keyof T]>;

  for (const key of Object.keys(obj) as Array<keyof T>) {
    const newKey = fn(key, obj[key]);
    result[newKey] = obj[key];
  }

  return result;
}

/**
 * Transform object values with a function.
 *
 * Creates a new object with values transformed by the provided function.
 *
 * @param obj - Source object
 * @param fn - Function to transform values
 * @returns New object with transformed values
 *
 * @example Basic usage
 * ```typescript
 * mapValues({ a: 1, b: 2 }, (val) => val * 2);
 * // { a: 2, b: 4 }
 * ```
 *
 * @example String transformation
 * ```typescript
 * mapValues({ name: 'alice', city: 'ny' }, (val) => val.toUpperCase());
 * // { name: 'ALICE', city: 'NY' }
 * ```
 *
 * @example Complex transformation
 * ```typescript
 * mapValues({ a: 1, b: 2 }, (val, key) => `${key}:${val}`);
 * // { a: 'a:1', b: 'b:2' }
 * ```
 *
 * @see {@link mapKeys} for transforming keys
 */
export function mapValues<T extends object, R>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => R
): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;

  for (const key of Object.keys(obj) as Array<keyof T>) {
    result[key] = fn(obj[key], key);
  }

  return result;
}

/**
 * Swap keys and values of an object.
 *
 * Creates a new object where keys become values and values become keys.
 * If values are not unique, later values will overwrite earlier ones.
 *
 * @param obj - Source object
 * @returns Inverted object
 *
 * @example Basic usage
 * ```typescript
 * invert({ a: '1', b: '2', c: '3' });
 * // { '1': 'a', '2': 'b', '3': 'c' }
 * ```
 *
 * @example Number values
 * ```typescript
 * invert({ a: 1, b: 2, c: 3 });
 * // { 1: 'a', 2: 'b', 3: 'c' }
 * ```
 *
 * @example Duplicate values
 * ```typescript
 * invert({ a: 'x', b: 'x', c: 'y' });
 * // { 'x': 'b', 'y': 'c' } (last 'x' wins)
 * ```
 *
 * @example Non-string keys become strings
 * ```typescript
 * invert({ 1: 'a', 2: 'b' });
 * // { 'a': '1', 'b': '2' }
 * ```
 */
export function invert<T extends object>(obj: T): Record<string, keyof T> {
  const result = {} as Record<string, keyof T>;

  for (const key of Object.keys(obj) as Array<keyof T>) {
    result[String(obj[key])] = key;
  }

  return result;
}

/**
 * Flip function argument order.
 *
 * Creates a new function with reversed argument order.
 *
 * @param fn - Function to flip
 * @returns New function with flipped arguments
 *
 * @example Basic usage
 * ```typescript
 * const divide = (a: number, b: number) => a / b;
 * const flippedDivide = flip(divide);
 * divide(10, 2); // 5
 * flippedDivide(10, 2); // 0.2 (same as divide(2, 10))
 * ```
 *
 * @example With map
 * ```typescript
 * const subtract = (a: number, b: number) => a - b;
 * const subtractFrom10 = flip(subtract)(10);
 * [1, 2, 3, 4, 5].map(subtractFrom10);
 * // [9, 8, 7, 6, 5]
 * ```
 *
 * @example With currying
 * ```typescript
 * const append = (prefix: string, suffix: string) => prefix + suffix;
 * const appendToHello = flip(append)('hello');
 * appendToHello(' world'); // ' worldhello'
 * ```
 */
export function flip<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: Parameters<T>) => {
    return fn(...args.reverse());
  }) as T;
}

/**
 * Compose functions right-to-left.
 *
 * Creates a function that applies functions from right to left.
 * Result of each function is passed as argument to the next.
 *
 * @param fns - Functions to compose
 * @returns Composed function
 *
 * @example Basic usage
 * ```typescript
 * const add = (x: number) => x + 1;
 * const multiply = (x: number) => x * 2;
 * const toString = (x: number) => x.toString();
 *
 * const process = compose(toString, multiply, add);
 * process(5);
 * // '12' (5 + 1 = 6, 6 * 2 = 12, '12')
 * ```
 *
 * @example Complex transformation
 * ```typescript
 * const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
 * const exclaim = (s: string) => s + '!';
 * const greet = compose(exclaim, capitalize);
 *
 * greet('hello');
 * // 'Hello!'
 * ```
 *
 * @example Pipeline explanation
 * ```typescript
 * const f1 = (x) => x + 1;
 * const f2 = (x) => x * 2;
 * const f3 = (x) => x.toString();
 *
 * compose(f3, f2, f1)(5);
 * // Equivalent to: f3(f2(f1(5)))
 * // Equivalent to: f3(f2(6))
 * // Equivalent to: f3(12)
 * // Result: '12'
 * ```
 *
 * @see {@link pipe} for left-to-right composition
 */
export function compose<T>(...fns: Array<(arg: any) => any>): (arg: T) => any {
  return (arg: T) => {
    return fns.reduceRight((acc, fn) => fn(acc), arg);
  };
}

/**
 * Compose functions left-to-right.
 *
 * Creates a function that applies functions from left to right.
 * Result of each function is passed as argument to the next.
 *
 * @param fns - Functions to compose
 * @returns Composed function
 *
 * @example Basic usage
 * ```typescript
 * const add = (x: number) => x + 1;
 * const multiply = (x: number) => x * 2;
 * const toString = (x: number) => x.toString();
 *
 * const pipeline = pipe(add, multiply, toString);
 * pipeline(5);
 * // '12' (5 + 1 = 6, 6 * 2 = 12, '12')
 * ```
 *
 * @example Data transformation
 * ```typescript
 * const toNumber = (s: string) => parseInt(s);
 * const double = (x: number) => x * 2;
 * const toString = (x: number) => x.toString();
 *
 * const transform = pipe(toNumber, double, toString);
 * transform('5');
 * // '10'
 * ```
 *
 * @example API data processing
 * ```typescript
 * const fetchData = () => ({ items: [{ price: 10 }, { price: 20 }] });
 * const getItems = (data) => data.items;
 * const sumPrices = (items) => items.reduce((sum, item) => sum + item.price, 0);
 *
 * const getTotal = pipe(fetchData, getItems, sumPrices);
 * await getTotal(); // 30
 * ```
 *
 * @example Pipeline explanation
 * ```typescript
 * const f1 = (x) => x + 1;
 * const f2 = (x) => x * 2;
 * const f3 = (x) => x.toString();
 *
 * pipe(f1, f2, f3)(5);
 * // Equivalent to: f3(f2(f1(5)))
 * // Equivalent to: f3(f2(6))
 * // Equivalent to: f3(12)
 * // Result: '12'
 * ```
 *
 * @see {@link compose} for right-to-left composition
 */
export function pipe<T>(...fns: Array<(arg: any) => any>): (arg: T) => any {
  return (arg: T) => {
    return fns.reduce((acc, fn) => fn(acc), arg);
  };
}
