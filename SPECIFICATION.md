# @oxog/utils - Specification

## Package Identity

| Field | Value |
|-------|-------|
| **NPM Package** | `@oxog/utils` |
| **GitHub Repository** | `https://github.com/ersinkoc/utils` |
| **Documentation Site** | `https://utils.oxog.dev` |
| **License** | MIT |
| **Author** | Ersin Koç (ersinkoc) |

## Package Description

**One-line:** Zero-dependency, type-safe utility functions for Node.js backends

A modern, tree-shakeable alternative to lodash designed specifically for backend Node.js development. Built with micro-kernel architecture, offering core utility functions for object, array, and string manipulation with optional plugins for deep operations, async utilities, type guards, and transformations. Every function is type-safe with full TypeScript inference, immutable by default, and protected against common vulnerabilities like prototype pollution.

## Non-Negotiable Rules

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

### 4. TYPESCRIPT STRICT MODE

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

### 5. LLM-NATIVE DESIGN

Package must be designed for both humans AND AI assistants:

- **llms.txt** file in root (< 2000 tokens)
- **Predictable API** naming (`get`, `set`, `has`, `is`, `pick`, `omit`)
- **Rich JSDoc** with @example on every public API
- **15+ examples** organized by category
- **README** optimized for LLM consumption

### 6. NO EXTERNAL LINKS

- ✅ GitHub repository URL
- ✅ Custom domain (utils.oxog.dev)
- ✅ npm package URL
- ❌ Social media (Twitter, LinkedIn, etc.)
- ❌ Discord/Slack links
- ❌ Email addresses
- ❌ Donation/sponsor links

## Technical Requirements

| Requirement | Value |
|-------------|-------|
| Runtime | Node.js only |
| Module Format | ESM + CJS dual |
| Node.js Version | >= 18.0.0 |
| TypeScript Version | >= 5.0 |
| Bundle Size (core) | < 3KB gzipped |
| Bundle Size (all plugins) | < 8KB gzipped |

## Core Features

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

### 4. Deep Utilities (optional/deep)

Functions for deep object operations with circular reference handling.

| Function | Description |
|----------|-------------|
| `cloneDeep(obj)` | Deep clone with circular ref support |
| `mergeDeep(target, ...sources)` | Deep merge (prototype protected) |
| `isEqual(a, b)` | Deep equality comparison |
| `diff(a, b)` | Get differences between objects |

### 5. Async Utilities (optional/async)

Functions for async flow control.

| Function | Description |
|----------|-------------|
| `debounce(fn, wait, options?)` | Debounce with cancel/flush/pending |
| `throttle(fn, wait, options?)` | Throttle with leading/trailing |
| `sleep(ms)` | Promise-based delay |
| `retry(fn, options?)` | Retry with exponential backoff |
| `timeout(promise, ms)` | Add timeout to promise |

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

## Plugin System

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

## API Design

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

## Safety & Best Practices

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

## Package Exports

```json
{
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
  }
}
```

## Package Keywords

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

## Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| `INVALID_PATH` | Path string is malformed | Check path syntax |
| `CIRCULAR_REF` | Circular reference in cloneDeep | Use with objects that have circular refs |
| `TIMEOUT` | Operation timed out | Increase timeout or optimize |
| `MAX_RETRIES_EXCEEDED` | Retry attempts exhausted | Check error handler or increase attempts |
| `PLUGIN_ALREADY_REGISTERED` | Plugin name conflict | Use unique plugin names |
| `PLUGIN_NOT_FOUND` | Requested plugin doesn't exist | Check plugin name or register first |
| `PLUGIN_DEPENDENCY_MISSING` | Required plugin not loaded | Load dependency plugin first |

## Documentation Requirements

### 1. llms.txt File

Create `/llms.txt` in project root (< 2000 tokens) with:
- Package name and one-line description
- Installation command
- Basic usage examples
- API summary organized by category
- Common patterns
- Error codes and solutions
- Links (GitHub, docs only)

### 2. JSDoc Requirements

Every public API MUST have:
- Function description
- @param tags with descriptions
- @returns tag with description
- @example tags with multiple scenarios
- @see tags for related functions

### 3. Example Organization

Minimum 15 examples in numbered folders:
- 01-basic/ - Core API usage
- 02-plugins/ - Plugin-specific usage
- 03-error-handling/ - Error scenarios
- 04-typescript/ - TypeScript features
- 05-integrations/ - Framework integrations (Express, Fastify, NestJS, tRPC, Prisma)
- 06-real-world/ - Practical use cases

### 4. README Requirements

First 500 tokens optimized for LLM consumption with:
- Package name and purpose
- Installation command
- 3-5 quick examples
- Import patterns
- Link to full documentation

## Website Requirements

### Technology Stack
- React 19 + Vite 6 + TypeScript
- Tailwind CSS v4 (CSS-first configuration)
- shadcn/ui for UI components
- @oxog/codeshine for syntax highlighting
- Lucide React for icons
- JetBrains Mono + Inter fonts

### Required Features
- IDE-style code blocks with macOS traffic lights
- Dark/Light theme toggle (synced with codeshine)
- GitHub star button with real count
- Footer: "Made with ❤️ by Ersin KOÇ"
- Links to github.com/ersinkoc/utils
- npm package link
- CNAME: utils.oxog.dev

### Required Pages
- Home - Overview and quick start
- Getting Started - Installation and setup
- API Reference - Complete API documentation
- Examples - Usage examples
- Plugins - Plugin documentation
- Playground - Interactive code demo

## MCP Server Requirements

Create an MCP server for LLM integration with these tools:

### Tool 1: utils_search_docs
- Search @oxog/utils documentation
- Input: query string
- Output: Relevant documentation sections

### Tool 2: utils_get_example
- Get usage example for a specific function
- Input: function name (e.g., "get", "groupBy")
- Output: Code examples with explanation

### Tool 3: utils_api_reference
- Get API reference for a function
- Input: function name
- Output: Full API documentation

## Testing Requirements

### Coverage Thresholds
- Lines: 100%
- Functions: 100%
- Branches: 100%
- Statements: 100%

### Test Organization
- tests/unit/ - Unit tests for each function
- tests/integration/ - Integration tests
- tests/fixtures/ - Test data and utilities

### Test Framework
- Vitest with v8 coverage provider
- Global test environment
- Node.js environment

## Build Requirements

### Build Tool
- tsup for bundling
- Dual output: ESM + CJS
- TypeScript declarations (.d.ts)
- Source maps

### Bundle Size Targets
- Core: < 3KB gzipped
- All plugins: < 8KB gzipped

### Output Format
- ES2022 target
- ESNext modules
- Tree-shaking enabled
- No external runtime dependencies

## Deployment

### GitHub Actions
- Single workflow: deploy.yml
- Triggers: push to main, workflow_dispatch
- Steps: install, test, build, deploy to GitHub Pages

### Deployment Target
- GitHub Pages
- Domain: utils.oxog.dev
- Automatic deployment on main branch

## Version Management

### Semantic Versioning
- Major: Breaking changes
- Minor: New features (backwards compatible)
- Patch: Bug fixes

### Changelog
- CHANGELOG.md with version history
- Follow Keep a Changelog format
- Documented for every release
