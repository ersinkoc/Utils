import { get, set, setMut, has, pick, omit, merge } from '@oxog/utils';

// Safe property access
const user = { name: 'Ersin', address: { city: 'Istanbul', country: 'Turkey' } };

console.log(get(user, 'name'));
console.log(get(user, 'address.city'));
console.log(get(user, 'address.zip', '00000'));

// Immutable update
const updated = set(user, 'address.city', 'Ankara');
console.log(user.address.city);
console.log(updated.address.city);

// Mutable update
setMut(user, 'name', 'Ali');
console.log(user.name);

// Check if path exists
console.log(has(user, 'name'));
console.log(has(user, 'address.city'));
console.log(has(user, 'address.zip'));

// Pick specific keys
const simple = pick(user, ['name', 'address.city']);
console.log(simple);

// Omit specific keys
const noAddress = omit(user, ['address']);
console.log(noAddress);

// Safe merge
const data = merge({ a: 1 }, { b: 2 });
console.log(data);

const config = merge({ api: { timeout: 5000 } }, { api: { retries: 3 } });
console.log(config);

// Prototype pollution protection
const malicious = { __proto__: { evil: true } };
const safe = merge({}, malicious);
console.log(safe);
console.log(safe.evil);
