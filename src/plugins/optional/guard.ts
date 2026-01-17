/**
 * Check if collection is empty.
 *
 * Returns true for empty arrays, objects, Maps, or Sets.
 * Note: Unlike lodash, this returns false for strings and numbers!
 *
 * @param value - Value to check
 * @returns True if collection is empty
 *
 * @example Arrays
 * ```typescript
 * isEmpty([]); // true
 * isEmpty([1, 2, 3]); // false
 * ```
 *
 * @example Objects
 * ```typescript
 * isEmpty({}); // true
 * isEmpty({ a: 1 }); // false
 * ```
 *
 * @example Map and Set
 * ```typescript
 * isEmpty(new Map()); // true
 * isEmpty(new Set()); // true
 * isEmpty(new Map([['a', 1]])); // false
 * ```
 *
 * @example Non-collections (returns false)
 * ```typescript
 * isEmpty(''); // false - strings are not collections
 * isEmpty(0); // false - numbers are not collections
 * isEmpty(false); // false - booleans are not collections
 * isEmpty(null); // false - null is not a collection
 * isEmpty(undefined); // false - undefined is not a collection
 * ```
 *
 * @see {@link isNil} for null/undefined check
 */
export function isEmpty(
  value: unknown
): value is
  | []
  | Record<string, never>
  | Map<any, never>
  | Set<never> {
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map) return value.size === 0;
  if (value instanceof Set) return value.size === 0;
  // Exclude Date, RegExp, and other built-in objects from "empty object" check
  if (value instanceof Date || value instanceof RegExp) return false;
  if (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Map) &&
    !(value instanceof Set)
  ) {
    return Object.keys(value).length === 0;
  }
  return false;
}

/**
 * Check if value is null or undefined.
 *
 * @param value - Value to check
 * @returns True if value is null or undefined
 *
 * @example Basic usage
 * ```typescript
 * isNil(null); // true
 * isNil(undefined); // true
 * ```
 *
 * @example False cases
 * ```typescript
 * isNil(0); // false
 * isNil(''); // false
 * isNil(false); // false
 * isNil([]); // false
 * isNil({}); // false
 * ```
 *
 * @see {@link isEmpty} for collection emptiness check
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if value is a plain object.
 *
 * Returns true for plain objects created by object literal or Object.create(null).
 * Returns false for class instances, arrays, Date, RegExp, etc.
 *
 * @param value - Value to check
 * @returns True if value is a plain object
 *
 * @example Plain objects
 * ```typescript
 * isPlainObject({}); // true
 * isPlainObject({ a: 1 }); // true
 * isPlainObject(Object.create(null)); // true
 * ```
 *
 * @example Non-plain objects
 * ```typescript
 * isPlainObject(new Date()); // false (class instance)
 * isPlainObject([]); // false (array)
 * isPlainObject(/test/); // false (RegExp)
 * isPlainObject(new Map()); // false (Map)
 * isPlainObject(new Set()); // false (Set)
 * isPlainObject(() => {}); // false (function)
 * isPlainObject(null); // false
 * isPlainObject(undefined); // false
 * ```
 *
 * @example Class instances
 * ```typescript
 * class MyClass {}
 * isPlainObject(new MyClass()); // false
 * ```
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;

  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Type guard for arrays.
 *
 * @param value - Value to check
 * @returns True if value is an array
 *
 * @example Basic usage
 * ```typescript
 * const value: unknown = [1, 2, 3];
 * if (isArray(value)) {
 *   value.map(x => x * 2); // TypeScript knows it's an array
 * }
 * ```
 */
export function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

/**
 * Type guard for strings.
 *
 * @param value - Value to check
 * @returns True if value is a string
 *
 * @example Basic usage
 * ```typescript
 * const value: unknown = 'hello';
 * if (isString(value)) {
 *   value.toUpperCase(); // TypeScript knows it's a string
 * }
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for numbers.
 *
 * Returns false for NaN (unlike typeof operator).
 *
 * @param value - Value to check
 * @returns True if value is a valid number
 *
 * @example Basic usage
 * ```typescript
 * isNumber(42); // true
 * isNumber(3.14); // true
 * isNumber(-5); // true
 * isNumber(Infinity); // true
 * ```
 *
 * @example NaN handling
 * ```typescript
 * isNumber(NaN); // false (unlike typeof!)
 * typeof NaN === 'number'; // true
 * ```
 *
 * @example Non-numbers
 * ```typescript
 * isNumber('42'); // false
 * isNumber(null); // false
 * isNumber(undefined); // false
 * isNumber({}); // false
 * ```
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Type guard for functions.
 *
 * @param value - Value to check
 * @returns True if value is a function
 *
 * @example Basic usage
 * ```typescript
 * isFunction(() => {}); // true
 * isFunction(function() {}); // true
 * isFunction(async () => {}); // true
 * ```
 *
 * @example Non-functions
 * ```typescript
 * isFunction({}); // false
 * isFunction(null); // false
 * isFunction(undefined); // false
 * isFunction('string'); // false
 * ```
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

/**
 * Type guard for valid Date objects.
 *
 * Returns true for Date objects with valid time values.
 *
 * @param value - Value to check
 * @returns True if value is a valid Date
 *
 * @example Valid dates
 * ```typescript
 * isDate(new Date()); // true
 * isDate(new Date('2024-01-01')); // true
 * ```
 *
 * @example Invalid dates
 * ```typescript
 * isDate(new Date('invalid')); // false
 * isDate(Date.now()); // false (number)
 * ```
 *
 * @example Non-dates
 * ```typescript
 * isDate({}); // false
 * isDate(null); // false
 * isDate(undefined); // false
 * isDate('2024-01-01'); // false (string)
 * ```
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
