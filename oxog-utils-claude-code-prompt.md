# @oxog/utils - Zero-Dependency NPM Package

## Package Identity

| Field | Value |
|-------|-------|
| **NPM Package** | `@oxog/utils` |
| **GitHub Repository** | `https://github.com/ersinkoc/utils` |
| **Documentation Site** | `https://utils.oxog.dev` |
| **License** | MIT |
| **Author** | Ersin Koç (ersinkoc) |

> **NO social media, Discord, email, or external links allowed.**

---

## Package Description

**One-line:** Zero-dependency, type-safe utility functions for Node.js backends

A modern, tree-shakeable alternative to lodash designed specifically for backend Node.js development. Built with micro-kernel architecture, offering core utility functions for object, array, and string manipulation with optional plugins for deep operations, async utilities, type guards, and transformations. Every function is type-safe with full TypeScript inference, immutable by default, and protected against common vulnerabilities like prototype pollution.

---

## NON-NEGOTIABLE RULES

These rules are **ABSOLUTE** and must be followed without exception.

### 1. ZERO RUNTIME DEPENDENCIES

```json
{
  "dependencies": {}  // MUST BE EMPTY - NO EXCEPTIONS
}
```

- Implement EVERYTHING from scratch
- No lodash, no axios, no moment - nothing
- Write your own utilities, parsers, validators
- If you think you need a dependency, you don't

**Allowed devDependencies only:**
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "tsup": "^8.0.0",
    "@types/node": "^20.0.0",
    "prettier": "^3.0.0",
    "eslint": "^9.0.0"
  }
}
```

### 2. 100% TEST COVERAGE

- Every line of code must be tested
- Every branch must be tested
- Every function must be tested
- **All tests must pass** (100% success rate)
- Use Vitest for testing
- Coverage thresholds enforced in config

### 3. MICRO-KERNEL ARCHITECTURE

All packages MUST use plugin-based architecture:

```
┌─────────────────────────────────────────────────────┐
│                    User Code                         │
│  import { get, array } from '@oxog/utils'           │
│  import { cloneDeep } from '@oxog/utils/deep'       │
├─────────────────────────────────────────────────────┤
│              Plugin Registry API                     │
│      use() · register() · list() · has()            │
├───────────┬───────────┬───────────┬─────────────────┤
│  core/    │  core/    │  core/    │  optional/      │
│  object   │  array    │  string   │  deep, async,   │
│  (11 fn)  │  (10 fn)  │  (8 fn)   │  guard, transform│
├───────────┴───────────┴───────────┴─────────────────┤
│                  Micro Kernel                        │
│    Tree-shaking · Type inference · Safe defaults    │
└─────────────────────────────────────────────────────┘
```

**Kernel responsibilities (minimal):**
- Plugin registration and lifecycle
- Event bus for inter-plugin communication
- Error boundary and recovery
- Configuration management

### 4. DEVELOPMENT WORKFLOW

Create these documents **FIRST**, before any code:

1. **SPECIFICATION.md** - Complete package specification
2. **IMPLEMENTATION.md** - Architecture and design decisions  
3. **TASKS.md** - Ordered task list with dependencies

Only after all three documents are complete, implement code following TASKS.md sequentially.

### 5. TYPESCRIPT STRICT MODE

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "module": "ESNext"
  }
}
```

### 6. LLM-NATIVE DESIGN

Package must be designed for both humans AND AI assistants:

- **llms.txt** file in root (< 2000 tokens)
- **Predictable API** naming (`get`, `set`, `has`, `is`, `pick`, `omit`)
- **Rich JSDoc** with @example on every public API
- **15+ examples** organized by category
- **README** optimized for LLM consumption

### 7. NO EXTERNAL LINKS

- ✅ GitHub repository URL
- ✅ Custom domain (utils.oxog.dev)
- ✅ npm package URL
- ❌ Social media (Twitter, LinkedIn, etc.)
- ❌ Discord/Slack links
- ❌ Email addresses
- ❌ Donation/sponsor links

---

## CORE FEATURES

### 1. Object Utilities (core/object)

Functions for safe, immutable object manipulation with full TypeScript path inference.

| Function | Description |
|----------|-------------|
| `get(obj, path, defaultValue?)` | Safe property access with path inference |
| `set(obj, path, value)` | Immutable property setter (returns new object) |
| `setMut(obj, path, value)` | Mutable property setter (mutates original) |
| `has(obj, path)` | Check if path exists in object |
| `pick(obj, keys)` | Create object with selected keys only |
| `omit(obj, keys)` | Create object without specified keys |
| `merge(target, ...sources)` | Safe shallow merge (prototype pollution protected) |
| `keys(obj)` | Type-safe Object.keys() |
| `values(obj)` | Type-safe Object.values() |
| `entries(obj)` | Type-safe Object.entries() |
| `fromEntries(entries)` | Type-safe Object.fromEntries() |

**API Examples:**

```typescript
import { get, set, pick, omit, merge } from '@oxog/utils';

// get with full path autocomplete
const user = { name: 'Ersin', address: { city: 'Istanbul' } };
get(user, 'address.city'); // 'Istanbul' - TypeScript knows it's string
get(user, 'address.zip', '00000'); // '00000' (default value)

// set returns new object (immutable)
const updated = set(user, 'address.city', 'Ankara');
console.log(user.address.city); // 'Istanbul' (unchanged)
console.log(updated.address.city); // 'Ankara'

// pick and omit
pick(user, ['name']); // { name: 'Ersin' }
omit(user, ['address']); // { name: 'Ersin' }

// safe merge (prototype pollution protected)
merge({}, { a: 1 }, { b: 2 }); // { a: 1, b: 2 }
merge({}, { __proto__: { evil: true } }); // {} - filtered!
```

### 2. Array Utilities (core/array)

Functions for array transformation and grouping.

| Function | Description |
|----------|-------------|
| `groupBy(arr, key\|fn)` | Group array items by key or function |
| `keyBy(arr, key\|fn)` | Create object keyed by property |
| `chunk(arr, size)` | Split array into chunks |
| `uniq(arr)` | Remove duplicates (shallow) |
| `uniqBy(arr, key\|fn)` | Remove duplicates by key |
| `flatten(arr, depth?)` | Flatten nested arrays |
| `compact(arr)` | Remove falsy values |
| `first(arr, n?)` | Get first n elements |
| `last(arr, n?)` | Get last n elements |
| `sample(arr, n?)` | Random sample from array |

**API Examples:**

```typescript
import { groupBy, keyBy, chunk, uniq, flatten } from '@oxog/utils';

const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'user' }
];

// groupBy
groupBy(users, 'role');
// { admin: [{ id: 1, ... }], user: [{ id: 2, ... }, { id: 3, ... }] }

// keyBy
keyBy(users, 'id');
// { 1: { id: 1, ... }, 2: { id: 2, ... }, 3: { id: 3, ... } }

// chunk
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// uniq
uniq([1, 2, 2, 3, 3, 3]); // [1, 2, 3]

// flatten
flatten([[1, 2], [3, [4, 5]]], 2); // [1, 2, 3, 4, 5]
```

### 3. String Utilities (core/string)

Functions for string case conversion and manipulation.

| Function | Description |
|----------|-------------|
| `camelCase(str)` | Convert to camelCase |
| `kebabCase(str)` | Convert to kebab-case |
| `snakeCase(str)` | Convert to snake_case |
| `pascalCase(str)` | Convert to PascalCase |
| `capitalize(str)` | Capitalize first letter |
| `truncate(str, length, suffix?)` | Truncate with ellipsis |
| `slugify(str)` | URL-safe slug (Turkish/Unicode support) |
| `template(str, data)` | Simple string interpolation |

**API Examples:**

```typescript
import { camelCase, kebabCase, slugify, template } from '@oxog/utils';

camelCase('hello-world'); // 'helloWorld'
kebabCase('helloWorld'); // 'hello-world'
snakeCase('helloWorld'); // 'hello_world'
pascalCase('hello-world'); // 'HelloWorld'

// Turkish/Unicode aware slugify
slugify('Türkçe Başlık'); // 'turkce-baslik'
slugify('Привет мир'); // 'privet-mir'

// Simple template
template('Hello {{name}}!', { name: 'World' }); // 'Hello World!'
```

### 4. Deep Utilities (optional/deep)

Functions for deep object operations with circular reference handling.

| Function | Description |
|----------|-------------|
| `cloneDeep(obj)` | Deep clone with circular ref support |
| `mergeDeep(target, ...sources)` | Deep merge (prototype protected) |
| `isEqual(a, b)` | Deep equality comparison |
| `diff(a, b)` | Get differences between objects |

**API Examples:**

```typescript
import { cloneDeep, mergeDeep, isEqual, diff } from '@oxog/utils/deep';

// cloneDeep with circular reference handling
const obj = { a: 1 };
obj.self = obj; // circular!
const clone = cloneDeep(obj); // Works! No infinite loop

// mergeDeep
mergeDeep(
  { user: { name: 'A', settings: { theme: 'dark' } } },
  { user: { settings: { lang: 'tr' } } }
);
// { user: { name: 'A', settings: { theme: 'dark', lang: 'tr' } } }

// isEqual
isEqual({ a: { b: 1 } }, { a: { b: 1 } }); // true
isEqual([1, 2, 3], [1, 2, 3]); // true

// diff
diff({ a: 1, b: 2 }, { a: 1, b: 3, c: 4 });
// { changed: { b: { from: 2, to: 3 } }, added: { c: 4 }, removed: {} }
```

### 5. Async Utilities (optional/async)

Functions for async flow control.

| Function | Description |
|----------|-------------|
| `debounce(fn, wait, options?)` | Debounce with cancel/flush/pending |
| `throttle(fn, wait, options?)` | Throttle with leading/trailing |
| `sleep(ms)` | Promise-based delay |
| `retry(fn, options?)` | Retry with exponential backoff |
| `timeout(promise, ms)` | Add timeout to promise |

**API Examples:**

```typescript
import { debounce, throttle, sleep, retry, timeout } from '@oxog/utils/async';

// debounce with control methods
const debouncedSave = debounce(save, 300);
debouncedSave(data);
debouncedSave.cancel(); // Cancel pending
debouncedSave.flush(); // Execute immediately
debouncedSave.pending; // Check if pending

// throttle
const throttledScroll = throttle(onScroll, 100, { leading: true });

// sleep
await sleep(1000); // Wait 1 second

// retry with exponential backoff
const result = await retry(fetchData, {
  attempts: 3,
  delay: 1000,
  backoff: 'exponential'
});

// timeout
const data = await timeout(fetch('/api'), 5000);
// Throws TimeoutError if takes > 5 seconds
```

### 6. Type Guards (optional/guard)

Type-safe boolean checks for runtime type validation.

| Function | Description |
|----------|-------------|
| `isEmpty(value)` | Check if collection is empty (array, object, Map, Set only) |
| `isNil(value)` | Check if null or undefined |
| `isPlainObject(value)` | Check if plain object (not class instance) |
| `isArray(value)` | Type guard for arrays |
| `isString(value)` | Type guard for strings |
| `isNumber(value)` | Type guard for numbers (excludes NaN) |
| `isFunction(value)` | Type guard for functions |
| `isDate(value)` | Type guard for valid Date objects |

**API Examples:**

```typescript
import { isEmpty, isNil, isPlainObject, isNumber } from '@oxog/utils/guard';

// isEmpty - ONLY for collections (not like lodash!)
isEmpty([]); // true
isEmpty({}); // true
isEmpty(new Map()); // true
isEmpty(new Set()); // true
isEmpty(''); // false - strings not considered!
isEmpty(0); // false - numbers not considered!

// isNil
isNil(null); // true
isNil(undefined); // true
isNil(0); // false
isNil(''); // false

// isPlainObject
isPlainObject({}); // true
isPlainObject({ a: 1 }); // true
isPlainObject(new Date()); // false (class instance)
isPlainObject(null); // false

// isNumber excludes NaN
isNumber(42); // true
isNumber(NaN); // false (unlike typeof!)
isNumber(Infinity); // true
```

### 7. Transform Utilities (optional/transform)

Functions for object and function transformation.

| Function | Description |
|----------|-------------|
| `mapKeys(obj, fn)` | Transform object keys |
| `mapValues(obj, fn)` | Transform object values |
| `invert(obj)` | Swap keys and values |
| `flip(fn)` | Flip function argument order |
| `compose(...fns)` | Right-to-left function composition |
| `pipe(...fns)` | Left-to-right function composition |

**API Examples:**

```typescript
import { mapKeys, mapValues, invert, compose, pipe } from '@oxog/utils/transform';

// mapKeys
mapKeys({ a: 1, b: 2 }, (key) => key.toUpperCase());
// { A: 1, B: 2 }

// mapValues
mapValues({ a: 1, b: 2 }, (val) => val * 2);
// { a: 2, b: 4 }

// invert
invert({ a: '1', b: '2' }); // { '1': 'a', '2': 'b' }

// compose (right-to-left)
const process = compose(
  (x: number) => x.toString(),
  (x: number) => x * 2,
  (x: number) => x + 1
);
process(5); // '12' (5 + 1 = 6, 6 * 2 = 12, '12')

// pipe (left-to-right)
const pipeline = pipe(
  (x: number) => x + 1,
  (x: number) => x * 2,
  (x: number) => x.toString()
);
pipeline(5); // '12'
```

---

## PLUGIN SYSTEM

### Plugin Interface

```typescript
/**
 * Plugin interface for extending kernel functionality.
 * 
 * @typeParam TContext - Shared context type between plugins
 */
export interface Plugin<TContext = unknown> {
  /** Unique plugin identifier (kebab-case) */
  name: string;
  
  /** Semantic version (e.g., "1.0.0") */
  version: string;
  
  /** Other plugins this plugin depends on */
  dependencies?: string[];
  
  /**
   * Called when plugin is registered.
   * @param kernel - The kernel instance
   */
  install: (kernel: Kernel<TContext>) => void;
  
  /**
   * Called after all plugins are installed.
   * @param context - Shared context object
   */
  onInit?: (context: TContext) => void | Promise<void>;
  
  /**
   * Called when plugin is unregistered.
   */
  onDestroy?: () => void | Promise<void>;
  
  /**
   * Called on error in this plugin.
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void;
}
```

### Core Plugins (Always Loaded)

| Plugin | Description |
|--------|-------------|
| `object` | get, set, setMut, has, pick, omit, merge, keys, values, entries, fromEntries |
| `array` | groupBy, keyBy, chunk, uniq, uniqBy, flatten, compact, first, last, sample |
| `string` | camelCase, kebabCase, snakeCase, pascalCase, capitalize, truncate, slugify, template |

### Optional Plugins (Opt-in)

| Plugin | Description | Import Path |
|--------|-------------|-------------|
| `deep` | cloneDeep, mergeDeep, isEqual, diff | `@oxog/utils/deep` |
| `async` | debounce, throttle, sleep, retry, timeout | `@oxog/utils/async` |
| `guard` | isEmpty, isNil, isPlainObject, isArray, isString, isNumber, isFunction, isDate | `@oxog/utils/guard` |
| `transform` | mapKeys, mapValues, invert, flip, compose, pipe | `@oxog/utils/transform` |

---

## API DESIGN

### Import Patterns (Hybrid - All Work)

```typescript
// Pattern 1: Direct import (most common)
import { get, set, merge, groupBy, chunk } from '@oxog/utils';

// Pattern 2: Namespace import
import { object, array, string } from '@oxog/utils';
object.get(data, 'path');
array.groupBy(items, 'key');
string.camelCase('hello-world');

// Pattern 3: Subpath import for optional plugins
import { cloneDeep, isEqual } from '@oxog/utils/deep';
import { debounce, throttle } from '@oxog/utils/async';
import { isEmpty, isNil } from '@oxog/utils/guard';
import { mapKeys, compose } from '@oxog/utils/transform';

// Pattern 4: Full import
import * as u from '@oxog/utils';
u.get(data, 'path');
u.groupBy(items, 'key');
```

### Type Definitions

```typescript
/**
 * Path type for object property access with autocomplete.
 */
export type Path<T> = /* recursive path inference */;

/**
 * Get the type at a specific path in an object.
 */
export type PathValue<T, P extends Path<T>> = /* inferred type */;

/**
 * Options for get() function.
 */
export interface GetOptions {
  /** 
   * Enable strict mode - throws on invalid paths.
   * @default false 
   */
  strict?: boolean;
}

/**
 * Options for merge() function.
 */
export interface MergeOptions {
  /** 
   * Filter dangerous keys (__proto__, constructor, prototype).
   * @default true 
   */
  filterPrototype?: boolean;
}

/**
 * Options for debounce() function.
 */
export interface DebounceOptions {
  /** 
   * Invoke on leading edge of timeout.
   * @default false 
   */
  leading?: boolean;
  
  /** 
   * Invoke on trailing edge of timeout.
   * @default true 
   */
  trailing?: boolean;
  
  /** 
   * Maximum time to wait.
   * @default undefined 
   */
  maxWait?: number;
}

/**
 * Options for retry() function.
 */
export interface RetryOptions {
  /** 
   * Number of retry attempts.
   * @default 3 
   */
  attempts?: number;
  
  /** 
   * Delay between retries in ms.
   * @default 1000 
   */
  delay?: number;
  
  /** 
   * Backoff strategy.
   * @default 'exponential' 
   */
  backoff?: 'linear' | 'exponential' | 'none';
  
  /** 
   * Condition to retry.
   * @default () => true 
   */
  retryIf?: (error: Error) => boolean;
}
```

---

## TECHNICAL REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| Runtime | Node.js only |
| Module Format | ESM + CJS dual |
| Node.js Version | >= 18.0.0 |
| TypeScript Version | >= 5.0 |
| Bundle Size (core) | < 3KB gzipped |
| Bundle Size (all plugins) | < 8KB gzipped |

---

## LLM-NATIVE REQUIREMENTS

### 1. llms.txt File

Create `/llms.txt` in project root (< 2000 tokens):

```markdown
# @oxog/utils

> Zero-dependency, type-safe utility functions for Node.js backends

## Install

npm install @oxog/utils

## Basic Usage

import { get, set, groupBy, camelCase } from '@oxog/utils';

const user = { name: 'Ersin', address: { city: 'Istanbul' } };
const city = get(user, 'address.city'); // 'Istanbul'
const updated = set(user, 'name', 'Ali'); // immutable update

## API Summary

### Object Functions
- `get(obj, path, default?)` - Safe deep property access
- `set(obj, path, value)` - Immutable property setter
- `pick(obj, keys)` - Select specific keys
- `omit(obj, keys)` - Exclude specific keys
- `merge(target, ...sources)` - Safe shallow merge

### Array Functions
- `groupBy(arr, key)` - Group by property
- `keyBy(arr, key)` - Index by property
- `chunk(arr, size)` - Split into chunks
- `uniq(arr)` - Remove duplicates
- `flatten(arr, depth?)` - Flatten nested

### String Functions
- `camelCase(str)` - To camelCase
- `kebabCase(str)` - To kebab-case
- `slugify(str)` - URL-safe slug

### Optional Plugins
- `@oxog/utils/deep` - cloneDeep, mergeDeep, isEqual
- `@oxog/utils/async` - debounce, throttle, retry
- `@oxog/utils/guard` - isEmpty, isNil, isPlainObject
- `@oxog/utils/transform` - mapKeys, mapValues, compose

## Common Patterns

### Safe Property Access
const value = get(data, 'deeply.nested.value', 'default');

### Immutable Update
const newObj = set(obj, 'user.name', 'New Name');

### Group Array Items
const byCategory = groupBy(products, 'category');

## Errors

| Code | Meaning | Solution |
|------|---------|----------|
| `INVALID_PATH` | Path string is malformed | Check path syntax |
| `CIRCULAR_REF` | Circular reference in cloneDeep | Use with objects that have circular refs |
| `TIMEOUT` | Operation timed out | Increase timeout or optimize |

## Links

- Docs: https://utils.oxog.dev
- GitHub: https://github.com/ersinkoc/utils
```

### 2. API Naming Standards

Use predictable patterns LLMs can infer:

```typescript
// ✅ GOOD - Predictable
get()           // Read property
set()           // Write property (immutable)
setMut()        // Write property (mutable)
has()           // Boolean check
pick()          // Select keys
omit()          // Exclude keys
merge()         // Combine objects
groupBy()       // Group array
keyBy()         // Index array
chunk()         // Split array
uniq()          // Remove duplicates
flatten()       // Flatten array
camelCase()     // Convert string
slugify()       // URL-safe string
cloneDeep()     // Deep copy
isEqual()       // Deep compare
isEmpty()       // Collection check
isNil()         // Null/undefined check
debounce()      // Rate limit
throttle()      // Interval limit
retry()         // Auto retry

// ❌ BAD - Unpredictable
g(), s(), p(), o(), m(), gb(), kb()
```

### 3. JSDoc Requirements

Every public API MUST have:

```typescript
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
 * @see {@link set} for setting properties
 * @see {@link has} for checking existence
 */
export function get<T, P extends Path<T>, D = undefined>(
  obj: T,
  path: P,
  defaultValue?: D
): PathValue<T, P> | D;
```

### 4. Example Organization

Minimum 15 examples in numbered folders:

```
examples/
├── 01-basic/
│   ├── object-access.ts       # get, set, has
│   ├── array-operations.ts    # groupBy, chunk, uniq
│   ├── string-transforms.ts   # camelCase, slugify
│   └── README.md
├── 02-plugins/
│   ├── using-deep.ts          # cloneDeep, isEqual
│   ├── using-async.ts         # debounce, retry
│   ├── using-guard.ts         # isEmpty, isNil
│   ├── using-transform.ts     # mapKeys, compose
│   └── README.md
├── 03-error-handling/
│   ├── safe-access.ts         # Default values
│   ├── validation.ts          # Type guards
│   └── README.md
├── 04-typescript/
│   ├── path-inference.ts      # Full autocomplete
│   ├── generics.ts            # Generic types
│   ├── type-guards.ts         # Narrowing
│   └── README.md
├── 05-integrations/
│   ├── express/               # Express middleware example
│   ├── fastify/               # Fastify plugin example
│   ├── nestjs/                # NestJS service example
│   ├── trpc/                  # tRPC helper example
│   ├── prisma/                # Prisma result transformer
│   └── README.md
└── 06-real-world/
    ├── api-response-transform/
    ├── config-merge/
    ├── form-data-process/
    └── README.md
```

### 5. Package.json Keywords

```json
{
  "keywords": [
    "utils",
    "utilities",
    "lodash-alternative",
    "typescript",
    "backend",
    "nodejs",
    "tree-shakeable",
    "zero-dependencies",
    "type-safe",
    "functional"
  ]
}
```

---

## PROJECT STRUCTURE

```
utils/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Website deploy ONLY
├── src/
│   ├── index.ts                # Main entry, public exports
│   ├── kernel.ts               # Micro kernel core
│   ├── types.ts                # Type definitions (JSDoc rich!)
│   ├── errors.ts               # Custom error classes
│   ├── plugins/
│   │   ├── index.ts            # Plugin exports
│   │   ├── core/               # Core plugins (always loaded)
│   │   │   ├── index.ts
│   │   │   ├── object.ts       # get, set, pick, omit, merge, etc.
│   │   │   ├── array.ts        # groupBy, chunk, uniq, etc.
│   │   │   └── string.ts       # camelCase, slugify, etc.
│   │   └── optional/           # Optional plugins (opt-in)
│   │       ├── index.ts
│   │       ├── deep.ts         # cloneDeep, isEqual, etc.
│   │       ├── async.ts        # debounce, throttle, etc.
│   │       ├── guard.ts        # isEmpty, isNil, etc.
│   │       └── transform.ts    # mapKeys, compose, etc.
│   └── utils/                  # Internal utilities
│       └── index.ts
├── tests/
│   ├── unit/
│   │   ├── kernel.test.ts
│   │   ├── plugins/
│   │   │   ├── object.test.ts
│   │   │   ├── array.test.ts
│   │   │   ├── string.test.ts
│   │   │   ├── deep.test.ts
│   │   │   ├── async.test.ts
│   │   │   ├── guard.test.ts
│   │   │   └── transform.test.ts
│   │   └── utils/
│   ├── integration/
│   │   └── full-flow.test.ts
│   └── fixtures/
│       └── test-data.ts
├── examples/
│   ├── 01-basic/
│   ├── 02-plugins/
│   ├── 03-error-handling/
│   ├── 04-typescript/
│   ├── 05-integrations/
│   └── 06-real-world/
├── website/
│   ├── public/
│   │   ├── CNAME               # utils.oxog.dev
│   │   ├── llms.txt            # Copied from root
│   │   ├── favicon.svg
│   │   └── og-image.png
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── CodeBlock.tsx   # IDE-style with line numbers
│   │   │   ├── CopyButton.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── InstallTabs.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── DocsHome.tsx
│   │   │   ├── GettingStarted.tsx
│   │   │   ├── ApiReference.tsx
│   │   │   ├── Examples.tsx
│   │   │   ├── Plugins.tsx
│   │   │   └── Playground.tsx
│   │   └── hooks/
│   │       ├── useTheme.ts
│   │       └── useClipboard.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── mcp-server/                 # MCP Server for LLM integration
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts            # Server entry
│   │   ├── tools/
│   │   │   ├── search.ts       # Documentation search
│   │   │   ├── examples.ts     # Example retrieval
│   │   │   └── api.ts          # API reference
│   │   └── data/
│   │       ├── docs.json       # Searchable docs
│   │       └── examples/       # Example files
│   └── README.md
├── llms.txt                    # LLM reference (< 2000 tokens)
├── SPECIFICATION.md
├── IMPLEMENTATION.md
├── TASKS.md
├── README.md
├── CHANGELOG.md
├── LICENSE                     # MIT
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── .gitignore
```

---

## WEBSITE REQUIREMENTS

Create a documentation website following these specifications:

### Technology Stack
- React 19 + Vite 6 + TypeScript
- Tailwind CSS v4 (CSS-first configuration)
- shadcn/ui for UI components
- @oxog/codeshine for syntax highlighting
- Lucide React for icons
- JetBrains Mono + Inter fonts

### @oxog/codeshine Integration

Use @oxog/codeshine for ALL code blocks:
```tsx
import { CodeBlock } from '@oxog/codeshine/react';

// Theme must sync with app theme
const codeTheme = isDarkMode ? 'github-dark' : 'github-light';

<CodeBlock 
  code={code} 
  language="typescript" 
  theme={codeTheme}
  lineNumbers
  copyButton
/>
```

### Required Features
- IDE-style code blocks with macOS traffic lights
- Dark/Light theme toggle (synced with codeshine)
- GitHub star button with real count
- Footer: "Made with ❤️ by Ersin KOÇ"
- Links to github.com/ersinkoc/utils
- npm package link
- CNAME: utils.oxog.dev

### Code Block Wrapper Component

Create wrapper that provides:
- macOS-style window chrome (traffic light dots)
- Filename display
- Language badge
- Copy button with feedback
- Theme-aware (dark: github-dark, light: github-light)

---

## MCP SERVER

Create an MCP server for LLM integration with these tools:

### Tools

```typescript
// Tool 1: Search documentation
{
  name: 'utils_search_docs',
  description: 'Search @oxog/utils documentation',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' }
    },
    required: ['query']
  }
}

// Tool 2: Get example
{
  name: 'utils_get_example',
  description: 'Get usage example for a specific function',
  inputSchema: {
    type: 'object',
    properties: {
      function: { type: 'string', description: 'Function name (e.g., "get", "groupBy")' }
    },
    required: ['function']
  }
}

// Tool 3: API reference
{
  name: 'utils_api_reference',
  description: 'Get API reference for a function',
  inputSchema: {
    type: 'object',
    properties: {
      function: { type: 'string', description: 'Function name' }
    },
    required: ['function']
  }
}
```

---

## GITHUB ACTIONS

Single workflow file: `.github/workflows/deploy.yml`

```yaml
name: Deploy Website

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Build package
        run: npm run build
      
      - name: Build website
        working-directory: ./website
        run: |
          npm ci
          npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './website/dist'
  
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## CONFIG FILES

### tsup.config.ts

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/plugins/optional/deep.ts',
    'src/plugins/optional/async.ts',
    'src/plugins/optional/guard.ts',
    'src/plugins/optional/transform.ts'
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
});
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'website/',
        'examples/',
        'mcp-server/',
        '*.config.*',
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
```

### package.json

```json
{
  "name": "@oxog/utils",
  "version": "1.0.0",
  "description": "Zero-dependency, type-safe utility functions for Node.js backends",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./deep": {
      "import": {
        "types": "./dist/deep.d.ts",
        "default": "./dist/deep.js"
      },
      "require": {
        "types": "./dist/deep.d.cts",
        "default": "./dist/deep.cjs"
      }
    },
    "./async": {
      "import": {
        "types": "./dist/async.d.ts",
        "default": "./dist/async.js"
      },
      "require": {
        "types": "./dist/async.d.cts",
        "default": "./dist/async.cjs"
      }
    },
    "./guard": {
      "import": {
        "types": "./dist/guard.d.ts",
        "default": "./dist/guard.js"
      },
      "require": {
        "types": "./dist/guard.d.cts",
        "default": "./dist/guard.cjs"
      }
    },
    "./transform": {
      "import": {
        "types": "./dist/transform.d.ts",
        "default": "./dist/transform.js"
      },
      "require": {
        "types": "./dist/transform.d.cts",
        "default": "./dist/transform.cjs"
      }
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build && npm run test:coverage"
  },
  "keywords": [
    "utils",
    "utilities",
    "lodash-alternative",
    "typescript",
    "backend",
    "nodejs",
    "tree-shakeable",
    "zero-dependencies",
    "type-safe",
    "functional"
  ],
  "author": "Ersin Koç",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ersinkoc/utils.git"
  },
  "bugs": {
    "url": "https://github.com/ersinkoc/utils/issues"
  },
  "homepage": "https://utils.oxog.dev",
  "engines": {
    "node": ">=18"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^2.0.0"
  }
}
```

---

## SAFETY & BEST PRACTICES

### Immutability by Default

```typescript
// set() returns NEW object, never mutates
const user = { name: 'A' };
const updated = set(user, 'name', 'B');
console.log(user.name); // 'A' (unchanged!)
console.log(updated.name); // 'B'

// Use setMut() ONLY when mutation is intentional
setMut(user, 'name', 'B');
console.log(user.name); // 'B' (mutated)
```

### Prototype Pollution Protection

```typescript
// merge() automatically filters dangerous keys
merge({}, { __proto__: { evil: true } }); // {} - filtered!
merge({}, { constructor: { evil: true } }); // {} - filtered!
merge({}, { prototype: { evil: true } }); // {} - filtered!

// Same for mergeDeep()
mergeDeep({}, { a: { __proto__: { evil: true } } }); // { a: {} }
```

### Circular Reference Handling

```typescript
// cloneDeep() handles circular references
const obj = { a: 1 };
obj.self = obj; // circular!

const clone = cloneDeep(obj);
// Works! Returns: { a: 1, self: [Circular] }
```

### Nullish Semantics for Defaults

```typescript
// get() uses nullish coalescing semantics
get(obj, 'a', 'default'); // returns 'default' for undefined AND null
get({ a: false }, 'a', true); // false (not replaced!)
get({ a: 0 }, 'a', 1); // 0 (not replaced!)
get({ a: '' }, 'a', 'default'); // '' (not replaced!)
```

### isEmpty() Only for Collections

```typescript
// Unlike lodash, isEmpty() ONLY works on collections
isEmpty([]); // true
isEmpty({}); // true
isEmpty(new Map()); // true
isEmpty(new Set()); // true

// These return FALSE (not empty concepts for primitives)
isEmpty(''); // false - NOT a collection
isEmpty(0); // false - NOT a collection
isEmpty(false); // false - NOT a collection
```

---

## IMPLEMENTATION CHECKLIST

### Before Starting
- [ ] Create SPECIFICATION.md with complete spec
- [ ] Create IMPLEMENTATION.md with architecture
- [ ] Create TASKS.md with ordered task list
- [ ] All three documents reviewed and complete

### During Implementation
- [ ] Follow TASKS.md sequentially
- [ ] Write tests before or with each feature
- [ ] Maintain 100% coverage throughout
- [ ] JSDoc on every public API with @example
- [ ] Create examples as features are built

### Package Completion
- [ ] All tests passing (100%)
- [ ] Coverage at 100% (lines, branches, functions)
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Package builds without errors

### LLM-Native Completion
- [ ] llms.txt created (< 2000 tokens)
- [ ] llms.txt copied to website/public/
- [ ] README first 500 tokens optimized
- [ ] All public APIs have JSDoc + @example
- [ ] 15+ examples in organized folders
- [ ] package.json has 10 keywords
- [ ] API uses standard naming patterns

### Website Completion
- [ ] All pages implemented
- [ ] IDE-style code blocks with line numbers
- [ ] Copy buttons working
- [ ] Dark/Light theme toggle
- [ ] CNAME file with utils.oxog.dev
- [ ] Mobile responsive
- [ ] Footer with Ersin Koç, MIT, GitHub only

### MCP Server Completion
- [ ] All 3 tools implemented
- [ ] Documentation search works
- [ ] Example retrieval works
- [ ] API reference works
- [ ] README with usage instructions

### Final Verification
- [ ] `npm run build` succeeds
- [ ] `npm run test:coverage` shows 100%
- [ ] Website builds without errors
- [ ] All examples run successfully
- [ ] README is complete and accurate
- [ ] MCP server works correctly

---

## BEGIN IMPLEMENTATION

Start by creating **SPECIFICATION.md** with the complete package specification based on everything above.

Then create **IMPLEMENTATION.md** with architecture decisions.

Then create **TASKS.md** with ordered, numbered tasks.

Only after all three documents are complete, begin implementing code by following TASKS.md sequentially.

**Remember:**
- This package will be published to npm as `@oxog/utils`
- It must be production-ready
- Zero runtime dependencies
- 100% test coverage
- Professionally documented
- LLM-native design (llms.txt + MCP server)
- Beautiful documentation website at utils.oxog.dev
