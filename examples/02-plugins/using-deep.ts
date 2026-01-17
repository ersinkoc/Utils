import { cloneDeep, mergeDeep, isEqual, diff } from '@oxog/utils/deep';

const original = {
  user: {
    name: 'Alice',
    address: {
      city: 'Istanbul',
      country: 'Turkey'
    }
  },
  settings: {
    theme: 'dark',
    notifications: true
  }
};

// Deep clone with circular reference handling
const obj: any = { a: 1 };
obj.self = obj;

const cloned = cloneDeep(obj);
console.log(cloned);
console.log(cloned.self === cloned);

// Deep clone complex object
const clonedUser = cloneDeep(original);
console.log(clonedUser);
console.log(clonedUser !== original);
console.log(clonedUser.user !== original.user);

// Deep merge
const defaults = {
  user: { name: 'Guest', settings: { theme: 'light', language: 'en' } },
  api: { timeout: 5000 }
};

const custom = {
  user: { name: 'Alice', settings: { theme: 'dark' } },
  api: { retries: 3 }
};

const merged = mergeDeep(defaults, custom);
console.log(merged);

// Deep equality
const obj1 = { a: { b: { c: 1 } } };
const obj2 = { a: { b: { c: 1 } } };
const obj3 = { a: { b: { c: 2 } } };

console.log(isEqual(obj1, obj2));
console.log(isEqual(obj1, obj3));

console.log(isEqual([1, 2, 3], [1, 2, 3]));
console.log(isEqual(new Date('2024-01-01'), new Date('2024-01-01')));

// Diff objects
const before = {
  user: { name: 'Alice', age: 30 },
  settings: { theme: 'dark' }
};

const after = {
  user: { name: 'Alice', age: 31 },
  settings: { theme: 'dark', notifications: true }
};

const changes = diff(before, after);
console.log(changes);
