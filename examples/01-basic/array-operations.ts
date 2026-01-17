import { groupBy, keyBy, chunk, uniq, uniqBy, flatten, compact, first, last, sample } from '@oxog/utils';

const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'user' }
];

const products = [
  { id: 1, name: 'Laptop', category: 'electronics' },
  { id: 2, name: 'Book', category: 'books' },
  { id: 3, name: 'Phone', category: 'electronics' }
];

const numbers = [1, 2, 2, 3, 3, 3, 4, 5, 5];
const nested = [[1, 2], [3, [4, 5]], [[6, 7]]];

// Group by property
const byRole = groupBy(users, 'role');
console.log(byRole);

// Group by function
const byLength = groupBy(users, (u) => u.name.length);
console.log(byLength);

// Key by property
const byId = keyBy(users, 'id');
console.log(byId);
console.log(byId[2]);

// Chunk arrays
const pages = chunk(products, 2);
console.log(pages);

const numbersChunked = chunk(numbers, 3);
console.log(numbersChunked);

// Remove duplicates
const unique = uniq(numbers);
console.log(unique);

const uniqueUsers = uniqBy(users, 'role');
console.log(uniqueUsers);

// Flatten nested arrays
const flat = flatten(nested);
console.log(flat);

const flatDeep = flatten(nested, 3);
console.log(flatDeep);

// Compact falsy values
const withFalsy = [0, 1, false, 2, '', 3, null, 4, undefined, 5];
const compacted = compact(withFalsy);
console.log(compacted);

// Get first/last elements
const firstItem = first(users);
console.log(firstItem);

const firstThree = first(users, 3);
console.log(firstThree);

const lastItem = last(users);
console.log(lastItem);

const lastTwo = last(users, 2);
console.log(lastTwo);

// Random sample
const random = sample(users);
console.log(random);

const randomTwo = sample(users, 2);
console.log(randomTwo);
