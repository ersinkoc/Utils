# @oxog/utils - Implementation Architecture

## Overview

This document describes the architecture decisions and implementation strategy for `@oxog/utils`. The package follows a micro-kernel architecture with a plugin system for maximum flexibility and tree-shakeability.

## Architecture Principles

### 1. Micro-Kernel Design

The kernel is minimal and only handles:
- Plugin registration and lifecycle management
- Event bus for inter-plugin communication
- Error boundary and recovery
- Configuration management

All utility functions are implemented as plugins that register with the kernel.

### 2. Plugin-Based Architecture

```
Kernel (Core)
├── Plugin Registry
├── Event Bus
├── Error Handler
└── Config Manager

Plugins
├── Core Plugins (auto-loaded)
│   ├── object (11 functions)
│   ├── array (10 functions)
│   └── string (8 functions)
└── Optional Plugins (opt-in)
    ├── deep (4 functions)
    ├── async (5 functions)
    ├── guard (8 functions)
    └── transform (6 functions)
```

### 3. Type Safety

- TypeScript strict mode enabled
- Full type inference for paths and return types
- Generic types for flexible APIs
- Type guards for runtime validation

### 4. Immutability by Default

- All operations are immutable unless explicitly named with "Mut" suffix
- Functions return new objects/arrays rather than mutating originals
- Immutable operations are the default and recommended approach

### 5. Security

- Prototype pollution protection in all merge operations
- Input validation for all public APIs
- Safe defaults for all operations
- No external dependencies = reduced attack surface

## File Structure

```
utils/
├── src/
│   ├── index.ts                  # Main entry point
│   ├── kernel.ts                 # Micro-kernel core
│   ├── types.ts                  # Type definitions
│   ├── errors.ts                 # Custom error classes
│   ├── plugins/
│   │   ├── index.ts             # Plugin registry exports
│   │   ├── core/
│   │   │   ├── index.ts         # Core plugin exports
│   │   │   ├── object.ts        # Object utilities
│   │   │   ├── array.ts         # Array utilities
│   │   │   └── string.ts        # String utilities
│   │   └── optional/
│   │       ├── index.ts         # Optional plugin exports
│   │       ├── deep.ts          # Deep operations
│   │       ├── async.ts         # Async utilities
│   │       ├── guard.ts         # Type guards
│   │       └── transform.ts     # Transform utilities
│   └── utils/
│       └── index.ts             # Internal utilities
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
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── hooks/
│   └── public/
│       ├── CNAME
│       └── llms.txt
├── mcp-server/
│   ├── src/
│   │   ├── index.ts
│   │   ├── tools/
│   │   └── data/
│   └── package.json
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── llms.txt
```

## Type System Design

### Path Inference

The `get()` function uses recursive type inference to provide autocomplete:

```typescript
type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${Path<T[K]>}` | K
          : K
        : never
    }[keyof T]
  : never;

type PathValue<T, P extends Path<T>> =
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? PathValue<T[K], Rest>
      : never
    : P extends keyof T
      ? T[P]
      : never;
```

### Plugin Interface

```typescript
interface Plugin<TContext = unknown> {
  name: string;
  version: string;
  dependencies?: string[];
  install: (kernel: Kernel<TContext>) => void;
  onInit?: (context: TContext) => void | Promise<void>;
  onDestroy?: () => void | Promise<void>;
  onError?: (error: Error) => void;
}
```

### Error Classes

```typescript
class UtilsError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'UtilsError';
    this.code = code;
  }
}

class InvalidPathError extends UtilsError {
  constructor(path: string) {
    super(`Invalid path: ${path}`, 'INVALID_PATH');
  }
}

class CircularReferenceError extends UtilsError {
  constructor() {
    super('Circular reference detected', 'CIRCULAR_REF');
  }
}

class TimeoutError extends UtilsError {
  constructor(ms: number) {
    super(`Operation timed out after ${ms}ms`, 'TIMEOUT');
  }
}
```

## Core Plugin Implementation Strategies

### Object Utilities

#### get() - Path Resolution

Implementation strategy:
1. Parse path string (dot notation + array syntax)
2. Traverse object safely
3. Return undefined or default value if path doesn't exist
4. Type inference via PathValue<T, P>

```typescript
function get<T, P extends Path<T>, D = undefined>(
  obj: T,
  path: P,
  defaultValue?: D
): PathValue<T, P> | D {
  const keys = path.toString().split(/[\.\[]/g).map(k => k.replace(/[\]']/g, ''));
  let result: any = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue as D;
    }
    result = result[key];
  }

  return result ?? (defaultValue as D);
}
```

#### set() - Immutable Update

Implementation strategy:
1. Parse path string
2. Create shallow copies of each level
3. Update value at target path
4. Return new object

```typescript
function set<T, P extends Path<T>>(
  obj: T,
  path: P,
  value: any
): T {
  const keys = path.toString().split('.');
  return keys.reduceRight((acc, key, index) => {
    if (index === keys.length - 1) {
      return { ...acc, [key]: value };
    }
    return { ...acc, [key]: acc[key] ?? {} };
  }, obj);
}
```

#### merge() - Prototype Pollution Protection

Implementation strategy:
1. Filter dangerous keys (`__proto__`, `constructor`, `prototype`)
2. Shallow merge source objects into target
3. Return new object (immutable)

```typescript
function merge<T extends object, S extends object>(
  target: T,
  source: S
): T & S {
  const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (DANGEROUS_KEYS.includes(key)) continue;
    (result as any)[key] = source[key as keyof S];
  }

  return result as T & S;
}
```

### Array Utilities

#### groupBy() - Grouping Strategy

Implementation strategy:
1. Create result object
2. Get key from each item (property access or function)
3. Append item to appropriate group
4. Return grouped object

```typescript
function groupBy<T, K extends keyof T>(
  arr: T[],
  key: K | ((item: T) => string)
): Record<string, T[]> {
  const result: Record<string, T[]> = {};

  for (const item of arr) {
    const groupKey = typeof key === 'function'
      ? key(item)
      : String(item[key]);

    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
  }

  return result;
}
```

#### chunk() - Chunking Strategy

Implementation strategy:
1. Calculate number of chunks
2. Use slice to create each chunk
3. Return array of chunks

```typescript
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}
```

### String Utilities

#### camelCase() - Case Conversion

Implementation strategy:
1. Split by separators (space, dash, underscore)
2. Capitalize first letter of each word except first
3. Join without spaces

```typescript
function camelCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s\-_]+/)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
}
```

#### slugify() - URL-Safe Slug

Implementation strategy:
1. Transliterate Turkish characters
2. Transliterate other Unicode
3. Convert to lowercase
4. Replace non-alphanumeric with hyphens
5. Remove multiple consecutive hyphens

```typescript
function slugify(str: string): string {
  const turkishMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  return str
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

## Optional Plugin Implementation Strategies

### Deep Utilities

#### cloneDeep() - Deep Cloning with Circular Reference Handling

Implementation strategy:
1. Use WeakMap to track cloned objects
2. Handle special cases (Date, RegExp, Map, Set, etc.)
3. Recursively clone nested objects/arrays
4. Detect and handle circular references

```typescript
function cloneDeep<T>(obj: T, seen = new WeakMap()): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (seen.has(obj)) {
    return seen.get(obj);
  }

  // Handle special types
  if (obj instanceof Date) return new Date(obj) as T;
  if (obj instanceof RegExp) return new RegExp(obj) as T;
  if (obj instanceof Map) {
    const clone = new Map();
    seen.set(obj, clone);
    for (const [key, value] of obj) {
      clone.set(cloneDeep(key, seen), cloneDeep(value, seen));
    }
    return clone as T;
  }
  if (obj instanceof Set) {
    const clone = new Set();
    seen.set(obj, clone);
    for (const value of obj) {
      clone.add(cloneDeep(value, seen));
    }
    return clone as T;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clone = [] as any;
    seen.set(obj, clone);
    for (let i = 0; i < obj.length; i++) {
      clone[i] = cloneDeep(obj[i], seen);
    }
    return clone;
  }

  // Handle plain objects
  const clone = {} as any;
  seen.set(obj, clone);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = cloneDeep(obj[key], seen);
    }
  }

  return clone;
}
```

#### isEqual() - Deep Equality

Implementation strategy:
1. Handle primitive types
2. Check type equality first
3. Handle special types (Date, RegExp, Map, Set)
4. Compare arrays recursively
5. Compare objects recursively

```typescript
function isEqual(a: unknown, b: unknown): boolean {
  // Strict equality for primitives
  if (a === b) return true;

  // Handle null/undefined
  if (a == null || b == null) return false;

  // Check types
  if (typeof a !== typeof b) return false;

  // Handle special types
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!isEqual((a as any)[key], (b as any)[key])) {
        return false;
      }
    }

    return true;
  }

  return false;
}
```

### Async Utilities

#### debounce() - Debouncing with Control

Implementation strategy:
1. Use closure to store timeout ID and pending state
2. Cancel previous timeout on each call
3. Execute function after delay
4. Provide control methods (cancel, flush, pending)

```typescript
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: DebounceOptions = {}
): T & {
  cancel: () => void;
  flush: () => ReturnType<T>;
  pending: () => boolean;
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;
  let result: ReturnType<T>;

  const { leading = false, trailing = true } = options;

  const debounced = function (this: any, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;

    const invoke = () => {
      if (lastArgs) {
        result = fn.apply(lastThis, lastArgs);
        lastArgs = undefined;
      }
    };

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (leading && !timeoutId) {
      invoke();
    }

    timeoutId = setTimeout(() => {
      if (trailing) {
        invoke();
      }
      timeoutId = undefined;
    }, wait);
  } as T & {
    cancel: () => void;
    flush: () => ReturnType<T>;
    pending: () => boolean;
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
    lastArgs = undefined;
  };

  debounced.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      invoke();
    }
    return result;
  };

  debounced.pending = () => {
    return timeoutId !== undefined;
  };

  return debounced;
}
```

#### throttle() - Throttling with Leading/Trailing

Implementation strategy:
1. Store last execution time
2. Skip calls within throttle period
3. Configure leading/trailing edge behavior
4. Return throttled function

```typescript
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: ThrottleOptions = {}
): T & {
  cancel: () => void;
  pending: () => boolean;
} {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;

  const { leading = true, trailing = true } = options;

  const throttled = function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastCallTime);

    lastArgs = args;
    lastThis = this;

    if (remaining <= 0 || remaining > wait) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }

      lastCallTime = now;
      fn.apply(this, args);
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = undefined;
        if (lastArgs) {
          fn.apply(lastThis, lastArgs);
          lastArgs = undefined;
        }
      }, remaining);
    }
  } as T & {
    cancel: () => void;
    pending: () => boolean;
  };

  throttled.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
    lastArgs = undefined;
  };

  throttled.pending = () => {
    return timeoutId !== undefined;
  };

  return throttled;
}
```

### Type Guards

#### isEmpty() - Collection Emptiness Check

Implementation strategy:
1. Check for array/object types only
2. Return length === 0 for arrays
3. Return keys.length === 0 for objects
4. Return size === 0 for Map/Set
5. Return false for all other types (unlike lodash!)

```typescript
function isEmpty(value: unknown): value is Array<never> | Record<string, never> | Map<any, never> | Set<never> {
  if (Array.isArray(value)) return value.length === 0;
  if (isPlainObject(value)) return Object.keys(value).length === 0;
  if (value instanceof Map) return value.size === 0;
  if (value instanceof Set) return value.size === 0;
  return false;
}
```

#### isPlainObject() - Plain Object Check

Implementation strategy:
1. Check if typeof === 'object'
2. Check if constructor === Object
3. Check prototype chain
4. Exclude class instances and built-in objects

```typescript
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;

  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}
```

#### isNumber() - Number Type Guard

Implementation strategy:
1. Check typeof === 'number'
2. Exclude NaN (unlike typeof!)
3. Include Infinity and -Infinity

```typescript
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}
```

### Transform Utilities

#### compose() - Function Composition (Right-to-Left)

Implementation strategy:
1. Accept variadic function arguments
2. Create composed function that executes right-to-left
3. Pass result of each function to the next

```typescript
function compose<T>(...fns: Array<(arg: any) => any>): (arg: T) => any {
  return (arg: T) => {
    return fns.reduceRight((acc, fn) => fn(acc), arg);
  };
}
```

#### pipe() - Function Composition (Left-to-Right)

Implementation strategy:
1. Accept variadic function arguments
2. Create piped function that executes left-to-right
3. Pass result of each function to the next

```typescript
function pipe<T>(...fns: Array<(arg: any) => any>): (arg: T) => any {
  return (arg: T) => {
    return fns.reduce((acc, fn) => fn(acc), arg);
  };
}
```

## Kernel Implementation

The kernel provides the plugin system:

```typescript
class Kernel<TContext = unknown> {
  private plugins: Map<string, Plugin<TContext>> = new Map();
  private context: TContext = {} as TContext;
  private eventBus: EventBus = new EventBus();

  register(plugin: Plugin<TContext>): void {
    if (this.plugins.has(plugin.name)) {
      throw new UtilsError(
        `Plugin "${plugin.name}" already registered`,
        'PLUGIN_ALREADY_REGISTERED'
      );
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new UtilsError(
            `Plugin "${plugin.name}" requires "${dep}" to be registered first`,
            'PLUGIN_DEPENDENCY_MISSING'
          );
        }
      }
    }

    this.plugins.set(plugin.name, plugin);
    plugin.install(this);

    // Emit plugin registered event
    this.eventBus.emit('plugin:registered', { name: plugin.name });
  }

  async init(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.onInit) {
        await plugin.onInit(this.context);
      }
    }

    this.eventBus.emit('kernel:initialized');
  }

  getContext(): TContext {
    return this.context;
  }

  getPlugin(name: string): Plugin<TContext> | undefined {
    return this.plugins.get(name);
  }

  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  listPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  on(event: string, handler: (...args: any[]) => void): void {
    this.eventBus.on(event, handler);
  }

  off(event: string, handler: (...args: any[]) => void): void {
    this.eventBus.off(event, handler);
  }
}
```

## Export Strategy

### Main Entry (index.ts)

```typescript
// Export all core functions directly
export { get, set, setMut, has, pick, omit, merge, keys, values, entries, fromEntries } from './plugins/core/object';
export { groupBy, keyBy, chunk, uniq, uniqBy, flatten, compact, first, last, sample } from './plugins/core/array';
export { camelCase, kebabCase, snakeCase, pascalCase, capitalize, truncate, slugify, template } from './plugins/core/string';

// Export types
export type { Path, PathValue } from './types';

// Export namespace versions
export * as object from './plugins/core/object';
export * as array from './plugins/core/array';
export * as string from './plugins/core/string';

// Export kernel for plugin development
export { Kernel, Plugin } from './kernel';
```

### Optional Plugin Exports

Each optional plugin has its own entry point:

```typescript
// src/plugins/optional/deep.ts
export { cloneDeep, mergeDeep, isEqual, diff } from './deep';

// src/plugins/optional/async.ts
export { debounce, throttle, sleep, retry, timeout } from './async';

// src/plugins/optional/guard.ts
export { isEmpty, isNil, isPlainObject, isArray, isString, isNumber, isFunction, isDate } from './guard';

// src/plugins/optional/transform.ts
export { mapKeys, mapValues, invert, flip, compose, pipe } from './transform';
```

## Testing Strategy

### Unit Testing

Each function has comprehensive unit tests covering:
- Normal cases
- Edge cases
- Error cases
- Type inference
- Boundary conditions

Example test structure:

```typescript
describe('get', () => {
  it('should return value at path', () => {
    const obj = { a: { b: { c: 1 } } };
    expect(get(obj, 'a.b.c')).toBe(1);
  });

  it('should return default value for undefined path', () => {
    const obj = { a: { b: 1 } };
    expect(get(obj, 'a.c', 'default')).toBe('default');
  });

  it('should handle array notation', () => {
    const obj = { a: [1, 2, 3] };
    expect(get(obj, 'a[1]')).toBe(2);
  });

  it('should return undefined for non-existent path', () => {
    const obj = { a: 1 };
    expect(get(obj, 'b.c')).toBeUndefined();
  });
});
```

### Integration Testing

Integration tests verify:
- Plugin loading and initialization
- Inter-plugin communication
- End-to-end workflows

### Coverage Goals

- 100% line coverage
- 100% branch coverage
- 100% function coverage
- 100% statement coverage

## Bundle Optimization

### Tree-Shaking

- Each function is exported individually
- No unused code in bundles
- Dead code elimination enabled

### Code Splitting

- Core functions in main bundle
- Optional plugins in separate bundles
- Consumers only import what they need

### Minification

- TypeScript compiled to ES2022
- Tsup handles bundling and minification
- Source maps for debugging

## Documentation Strategy

### JSDoc Standards

Every public API has:
- Clear description
- @param tags with descriptions
- @returns tag with description
- @example tags (multiple)
- @see tags for related functions

### Example Organization

Examples organized by category:
- Basic usage
- Plugin-specific usage
- Error handling
- TypeScript features
- Framework integrations
- Real-world scenarios

### LLM-Native Design

- llms.txt with API summary (< 2000 tokens)
- Predictable naming patterns
- Rich JSDoc for AI assistants
- Common patterns documented

## Security Considerations

### Prototype Pollution Protection

All merge operations filter dangerous keys:
- `__proto__`
- `constructor`
- `prototype`

### Input Validation

- Type checking on all inputs
- Error handling for invalid inputs
- Safe defaults for all operations

### No External Dependencies

- All utilities implemented from scratch
- Reduced attack surface
- Full control over security

## Performance Considerations

### Immutable Operations

- Shallow copies for most operations
- Deep copies only when necessary (cloneDeep)
- Structural sharing where possible

### Memoization

- Consider memoizing expensive operations
- Cache results for pure functions
- Clear caches when necessary

### Lazy Evaluation

- Defer computation until needed
- Use generators for large datasets
- Stream processing for large arrays

## Deployment Strategy

### Build Process

1. Run tests with coverage
2. TypeScript compilation
3. Bundle with tsup
4. Generate type definitions
5. Build website
6. Deploy to GitHub Pages

### CI/CD Pipeline

GitHub Actions workflow:
- Trigger on push to main
- Install dependencies
- Run tests with coverage
- Build package
- Build website
- Deploy to GitHub Pages

### Version Management

- Semantic versioning
- CHANGELOG.md with all changes
- npm publish after successful CI
- Automated release notes

## Conclusion

This architecture provides:
- Flexible plugin system
- Zero runtime dependencies
- Type-safe APIs
- Immutable by default
- Security focused
- Tree-shakeable bundles
- 100% test coverage
- LLM-native design
- Beautiful documentation

The micro-kernel architecture with plugins ensures that the package is maintainable, extensible, and follows best practices for modern JavaScript/TypeScript development.
