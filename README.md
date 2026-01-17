# @oxog/utils

> Zero-dependency, type-safe utility functions for Node.js backends.

[![npm version](https://badge.fury.io/js/@oxog/utils.svg)](https://www.npmjs.com/package/@oxog/utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/node-%3E%2018.0.0-green.svg)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-216%20passed-success.svg)](https://github.com/ersinkoc/utils)

Modern, tree-shakeable utility library for Node.js backend development with zero dependencies. Full TypeScript support with automatic type inference.

## ✨ Features

- 📦 **Zero dependencies** - No runtime dependencies
- 🔒 **Type-safe** - Written in TypeScript with full type inference
- 🌳 **Tree-shakeable** - Import only what you need
- 🛡️ **Secure** - Prototype pollution protection built-in
- ⚡ **Performant** - Immutable by default, optimized for Node.js backends
- 🧪 **Well-tested** - 216 tests with 100% success rate
- 📝 **LLM-native** - Designed for AI/LLM code generation

## 📦 Installation

```bash
npm install @oxog/utils
```

## 🚀 Quick Start

```typescript
import { get, set, groupBy, camelCase } from '@oxog/utils';

// Object utilities
const user = { name: 'Ersin', address: { city: 'Istanbul' } };
const city = get(user, 'address.city'); // 'Istanbul'
const updated = set(user, 'name', 'Ali'); // new object, immutable

// Array utilities
const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' }
];
const grouped = groupBy(users, 'role');
// { admin: [{ id: 1, ... }], user: [{ id: 2, ... }] }

// String utilities
const slug = camelCase('hello-world'); // 'helloWorld'
```

## 📖 Import Patterns

### Main Package

```typescript
// Direct imports (recommended for tree-shaking)
import { get, set, merge, pick, omit } from '@oxog/utils';

// Namespace imports
import * as utils from '@oxog/utils';
utils.get(obj, 'path');
```

### Optional Plugins

```typescript
// Deep operations (clone, merge, diff, equality)
import { cloneDeep, isEqual, mergeDeep } from '@oxog/utils/deep';

// Async utilities (debounce, throttle, retry, timeout)
import { debounce, throttle, retry, sleep } from '@oxog/utils/async';

// Type guards (isEmpty, isNil, isPlainObject, etc.)
import { isEmpty, isNil, isPlainObject } from '@oxog/utils/guard';

// Function utilities (compose, pipe, mapKeys, etc.)
import { compose, pipe, flip } from '@oxog/utils/transform';
```

## 📚 API Reference

### Object Utilities

| Function | Description |
|----------|-------------|
| `get(obj, path, defaultValue?)` | Safe nested property access with type inference |
| `set(obj, path, value)` | Immutable property setter |
| `setMut(obj, path, value)` | Mutable property setter |
| `has(obj, path)` | Check if path exists in object |
| `pick(obj, keys)` | Create object with specified keys |
| `omit(obj, keys)` | Create object excluding specified keys |
| `merge(target, ...sources)` | Safe shallow merge with prototype pollution protection |
| `keys(obj)` | Type-safe Object.keys() |
| `values(obj)` | Type-safe Object.values() |
| `entries(obj)` | Type-safe Object.entries() |
| `fromEntries(entries)` | Type-safe Object.fromEntries() |

### Array Utilities

| Function | Description |
|----------|-------------|
| `groupBy(arr, key)` | Group array items by property or function |
| `keyBy(arr, key)` | Index array by property value |
| `chunk(arr, size)` | Split array into chunks |
| `uniq(arr)` | Remove duplicate values |
| `uniqBy(arr, key)` | Remove duplicates by key |
| `flatten(arr, depth?)` | Flatten nested arrays |
| `compact(arr)` | Remove falsy values |
| `first(arr, n?)` | Get first n elements |
| `last(arr, n?)` | Get last n elements |
| `sample(arr, n?)` | Get random sample(s) |

### String Utilities

| Function | Description |
|----------|-------------|
| `camelCase(str)` | Convert to camelCase |
| `kebabCase(str)` | Convert to kebab-case |
| `snakeCase(str)` | Convert to snake_case |
| `pascalCase(str)` | Convert to PascalCase |
| `capitalize(str)` | Capitalize first letter |
| `truncate(str, length, suffix?)` | Truncate string to length |
| `slugify(str)` | URL-safe slug with Turkish/Unicode support |
| `template(str, data)` | String interpolation with `{{variable}}` |

### Deep Utilities (`@oxog/utils/deep`)

| Function | Description |
|----------|-------------|
| `cloneDeep(obj)` | Deep clone with circular reference support |
| `mergeDeep(target, ...sources)` | Deep merge with prototype pollution protection |
| `isEqual(a, b)` | Deep equality comparison |
| `diff(a, b)` | Get differences between two objects |

### Async Utilities (`@oxog/utils/async`)

| Function | Description |
|----------|-------------|
| `debounce(fn, wait, options?)` | Debounce function execution |
| `throttle(fn, wait, options?)` | Throttle function execution |
| `sleep(ms)` | Sleep for specified milliseconds |
| `retry(options)` | Retry function with backoff |
| `timeout(promise, ms)` | Add timeout to promise |

### Type Guards (`@oxog/utils/guard`)

| Function | Description |
|----------|-------------|
| `isEmpty(value)` | Check if collection is empty |
| `isNil(value)` | Check if null or undefined |
| `isPlainObject(value)` | Check if plain object |
| `isArray(value)` | Type guard for arrays |
| `isString(value)` | Type guard for strings |
| `isNumber(value)` | Type guard for numbers (excludes NaN) |
| `isFunction(value)` | Type guard for functions |
| `isDate(value)` | Type guard for valid dates |

### Transform Utilities (`@oxog/utils/transform`)

| Function | Description |
|----------|-------------|
| `mapKeys(obj, fn)` | Transform object keys |
| `mapValues(obj, fn)` | Transform object values |
| `invert(obj)` | Swap keys and values |
| `flip(fn)` | Flip function argument order |
| `compose(...fns)` | Compose functions right-to-left |
| `pipe(...fns)` | Compose functions left-to-right |

## 💡 Usage Examples

### Type-Safe Property Access

```typescript
import { get, set } from '@oxog/utils';

interface User {
  profile?: {
    name: string;
    settings?: {
      theme: 'light' | 'dark';
    };
  };
}

const user: User = { profile: { name: 'Ersin' } };

// TypeScript infers return type automatically
const theme: 'light' | 'dark' | undefined = get(user, 'profile.settings.theme');
const updated = set(user, 'profile.settings.theme', 'dark' as const);
```

### Safe Deep Merging

```typescript
import { mergeDeep } from '@oxog/utils/deep';

const config = mergeDeep(
  { database: { host: 'localhost', port: 5432 } },
  { database: { credentials: { user: 'admin' } } }
);
```

### Retry with Exponential Backoff

```typescript
import { retry } from '@oxog/utils/async';

const data = await retry({
  fn: () => fetch('https://api.example.com'),
  attempts: 3,
  delay: 1000,
  backoff: 'exponential'
});
```

### Function Composition

```typescript
import { pipe } from '@oxog/utils/transform';

const processUser = pipe(
  (data: any) => validateUser(data),
  (user: User) => transformUser(user),
  (user: ProcessedUser) => saveUser(user)
);
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run coverage report
npm run test:coverage
```

- **216 tests** with 100% success rate
- **99.41% statement coverage**
- **100% function coverage**
- **95.36% branch coverage**

## 🔧 Scripts

```bash
npm run build       # Build the project
npm test            # Run tests
npm run test:watch  # Watch mode
npm run test:coverage  # Coverage report
npm run lint         # Lint source code
npm run format       # Format code with Prettier
npm run typecheck    # TypeScript type checking
```

## 🏗️ Build Output

```text
dist/
├── index.js              # ESM entry
├── index.cjs             # CommonJS entry
├── index.d.ts            # TypeScript definitions
├── index.d.cts           # CommonJS definitions
├── plugins/
│   ├── deep.js           # Deep operations
│   ├── async.js          # Async utilities
│   ├── guard.js          # Type guards
│   └── transform.js      # Transform utilities
```

## 🛡️ Security

This library includes built-in protection against prototype pollution attacks:

```typescript
import { merge } from '@oxog/utils';

// Dangerous keys are filtered automatically
const result = merge({}, { __proto__: { evil: true } });
console.log(result.evil); // undefined
```

## 📄 License

MIT © [Ersin Koç](https://github.com/ersinkoc/utils)

## 🔗 Links

- **Documentation**: [https://utils.oxog.dev](https://utils.oxog.dev)
- **GitHub**: [https://github.com/ersinkoc/utils](https://github.com/ersinkoc/utils)
- **Issues**: [https://github.com/ersinkoc/utils/issues](https://github.com/ersinkoc/utils/issues)

---

Made with ❤️ by [Ersin Koç](https://github.com/ersinkoc)
