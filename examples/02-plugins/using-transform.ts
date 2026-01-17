import { mapKeys, mapValues, invert, flip, compose, pipe } from '@oxog/utils/transform';

// mapKeys - transform object keys
const user = {
  firstName: 'Alice',
  lastName: 'Smith',
  emailAddress: 'alice@example.com'
};

const renamed = mapKeys(user, (key) => {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase();
});
console.log(renamed);

const withPrefix = mapKeys(user, (key) => `user_${key}`);
console.log(withPrefix);

// mapValues - transform object values
const prices = { apple: 1.5, banana: 0.8, orange: 1.2 };
const withTax = mapValues(prices, (price) => (price * 1.1).toFixed(2));
console.log(withTax);

const strings = { a: 'alice', b: 'bob', c: 'charlie' };
const uppercased = mapValues(strings, (val) => val.toUpperCase());
console.log(uppercased);

const numbers = { a: 1, b: 2, c: 3 };
const doubled = mapValues(numbers, (val, key) => {
  console.log(`Doubling ${key}: ${val}`);
  return val * 2;
});
console.log(doubled);

// invert - swap keys and values
const statusMap = { active: 'Active', inactive: 'Inactive', pending: 'Pending' };
const statusLookup = invert(statusMap);
console.log(statusLookup);

const roleIds = { admin: 1, user: 2, guest: 3 };
const idToRole = invert(roleIds);
console.log(idToRole);

// flip - flip function arguments
const divide = (a: number, b: number) => a / b;

console.log(divide(10, 2));

const flippedDivide = flip(divide);
console.log(flippedDivide(10, 2));

// With map
const subtractFrom = (base: number) => (value: number) => base - value;
const subtractFrom10 = flip(subtractFrom)(10);
const numbers = [1, 2, 3, 4, 5];
console.log(numbers.map(subtractFrom10));

// With bind
const prepend = (prefix: string, suffix: string) => `${prefix}${suffix}`;
const prependHello = flip(prepend)('hello');
console.log(prependHello(' world'));

// compose - right-to-left function composition
const add = (x: number) => x + 1;
const multiply = (x: number) => x * 2;
const toString = (x: number) => x.toString();

const process = compose(toString, multiply, add);
console.log(process(5));

// Complex transformation
const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, '-');
const truncate = (s: string) => s.slice(0, 20);
const addEllipsis = (s: string) => `${s}...`;

const slugify = compose(addEllipsis, truncate, toSlug);
console.log(slugify('This is a very long text'));

// pipe - left-to-right function composition
const pipeline = pipe(add, multiply, toString);
console.log(pipeline(5));

// Data transformation pipeline
const data = { a: 1, b: 2, c: 3 };

const sumValues = (obj: Record<string, number>) =>
  Object.values(obj).reduce((sum, val) => sum + val, 0);

const doubleResult = (sum: number) => sum * 2;

const result = pipe(sumValues, doubleResult)(data);
console.log(result);

// API data processing
const apiResponse = {
  data: {
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]
  }
};

const extractUsers = (res: any) => res.data.users;
const groupById = (users: any[]) => users.reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
const toObject = (result: any) => result;

const usersById = pipe(extractUsers, groupById, toObject);
console.log(usersById(apiResponse));

// Real-world: Form data transformation
const formData = {
  'first-name': 'Alice',
  'last-name': 'Smith',
  'email-address': 'alice@example.com'
};

const toCamel = (key: string) => key.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
const trimValue = (value: string) => value.trim();
const toLowerCase = (value: string) => value.toLowerCase();

const transformForm = pipe(
  (obj: Record<string, string>) => mapKeys(obj, toCamel),
  (obj: Record<string, string>) => mapValues(obj, trimValue),
  (obj: Record<string, string>) => mapValues(obj, toLowerCase)
);

const transformedForm = transformForm(formData);
console.log(transformedForm);

// Real-world: Processing pipeline
const rawText = '  Hello   World  ';

const trim = (s: string) => s.trim();
const normalizeSpaces = (s: string) => s.replace(/\s+/g, ' ');
const toUpper = (s: string) => s.toUpperCase();

const processText = pipe(trim, normalizeSpaces, toUpper);
console.log(processText(rawText));
