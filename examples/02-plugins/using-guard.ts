import { isEmpty, isNil, isPlainObject, isArray, isString, isNumber, isFunction, isDate } from '@oxog/utils/guard';

// isEmpty - ONLY for collections (unlike lodash!)
const data: unknown = [];

if (isEmpty(data)) {
  console.log('Data is empty');
}

const object: unknown = {};
if (isEmpty(object)) {
  console.log('Object is empty');
}

const map = new Map<string, number>();
if (isEmpty(map)) {
  console.log('Map is empty');
}

// These return FALSE (not empty concepts for primitives)
if (!isEmpty('')) {
  console.log('String is not considered empty');
}

if (!isEmpty(0)) {
  console.log('Number is not considered empty');
}

// isNil - null or undefined check
const value: unknown = null;

if (isNil(value)) {
  console.log('Value is null or undefined');
}

const optionalValue: unknown = undefined;
if (isNil(optionalValue)) {
  console.log('Optional value is missing');
}

// Falsy values are NOT nil
if (!isNil(0)) {
  console.log('0 is not nil');
}

if (!isNil('')) {
  console.log('Empty string is not nil');
}

if (!isNil(false)) {
  console.log('False is not nil');
}

// isPlainObject - plain object check
const obj1 = { a: 1, b: 2 };
if (isPlainObject(obj1)) {
  console.log('Plain object literal');
}

const obj2 = Object.create(null);
if (isPlainObject(obj2)) {
  console.log('Object.create(null) is plain');
}

// Class instances are NOT plain
const date = new Date();
if (!isPlainObject(date)) {
  console.log('Date instance is not plain');
}

const array = [];
if (!isPlainObject(array)) {
  console.log('Array is not plain');
}

// isArray - type guard
const items: unknown = [1, 2, 3];

if (isArray(items)) {
  items.forEach((item) => console.log(item));
}

const notArray: unknown = { 0: 1, 1: 2, 2: 3 };
if (!isArray(notArray)) {
  console.log('Array-like object is not array');
}

// isString - type guard
const text: unknown = 'hello world';

if (isString(text)) {
  console.log(text.toUpperCase());
}

const notString: unknown = 42;
if (!isString(notString)) {
  console.log('Number is not string');
}

// isNumber - type guard (excludes NaN!)
const num1: unknown = 42;
if (isNumber(num1)) {
  console.log('Valid number:', num1 * 2);
}

const num2: unknown = 3.14;
if (isNumber(num2)) {
  console.log('Valid number:', num2.toFixed(2));
}

const nan: unknown = NaN;
if (!isNumber(nan)) {
  console.log('NaN is not considered number');
}

const infinity: unknown = Infinity;
if (isNumber(infinity)) {
  console.log('Infinity is valid number');
}

// isFunction - type guard
const fn: unknown = (x: number) => x * 2;

if (isFunction(fn)) {
  console.log(fn(5));
}

const asyncFn: unknown = async () => {};
if (isFunction(asyncFn)) {
  console.log('Async function');
}

const notFn: unknown = {};
if (!isFunction(notFn)) {
  console.log('Object is not function');
}

// isDate - type guard
const validDate: unknown = new Date('2024-01-01');

if (isDate(validDate)) {
  console.log('Valid date:', validDate.getTime());
}

const invalidDate: unknown = new Date('invalid');
if (!isDate(invalidDate)) {
  console.log('Invalid date');
}

const dateNumber: unknown = Date.now();
if (!isDate(dateNumber)) {
  console.log('Date.now() returns number, not Date');
}

const dateString: unknown = '2024-01-01';
if (!isDate(dateString)) {
  console.log('String is not Date');
}

// Real-world: Form validation
function validateFormData(formData: unknown) {
  if (!isPlainObject(formData)) {
    throw new Error('Invalid form data');
  }

  if (isEmpty(formData)) {
    throw new Error('Form is empty');
  }

  return true;
}

// Real-world: API response validation
function validateAPIResponse(response: unknown) {
  if (isNil(response)) {
    throw new Error('No response');
  }

  if (!isPlainObject(response)) {
    throw new Error('Invalid response format');
  }

  return true;
}

// Real-world: Type checking before operations
function processValue(value: unknown) {
  if (isString(value)) {
    return value.toUpperCase();
  }

  if (isNumber(value)) {
    return value * 2;
  }

  if (isArray(value)) {
    return value.length;
  }

  return value;
}

console.log(processValue('hello'));
console.log(processValue(5));
console.log(processValue([1, 2, 3]));
