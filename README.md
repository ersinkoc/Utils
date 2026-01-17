# @oxog/utils

Zero-dependency, type-safe utility functions for Node.js backends.

## Install

```bash
npm install @oxog/utils
```

## Quick Start

```typescript
import { get, set, groupBy, camelCase } from '@oxog/utils';

const user = { name: 'Ersin', address: { city: 'Istanbul' } };
const city = get(user, 'address.city');
const updated = set(user, 'name', 'Ali');

const users = [{ role: 'admin' }, { role: 'user' }];
const grouped = groupBy(users, 'role');

const slug = camelCase('hello-world');
```

## Import Patterns

```typescript
// Direct import (most common)
import { get, set, merge } from '@oxog/utils';

// Namespace import
import { object, array, string } from '@oxog/utils';

// Optional plugins
import { cloneDeep } from '@oxog/utils/deep';
import { debounce } from '@oxog/utils/async';
import { isEmpty } from '@oxog/utils/guard';
import { compose } from '@oxog/utils/transform';
```

## Core Features

### Object
- `get()` - Safe property access with type inference
- `set()` - Immutable property setter
- `has()` - Check if path exists
- `pick()` / `omit()` - Select/exclude keys
- `merge()` - Safe shallow merge

### Array
- `groupBy()` - Group array items
- `keyBy()` - Index by property
- `chunk()` - Split into chunks
- `uniq()` - Remove duplicates
- `flatten()` - Flatten nested arrays

### String
- `camelCase()` / `kebabCase()` / `snakeCase()`
- `slugify()` - URL-safe with Turkish support
- `template()` - String interpolation

## Optional Plugins

### Deep
```typescript
import { cloneDeep, isEqual, mergeDeep } from '@oxog/utils/deep';
```

### Async
```typescript
import { debounce, throttle, retry, timeout } from '@oxog/utils/async';
```

### Guard
```typescript
import { isEmpty, isNil, isPlainObject } from '@oxog/utils/guard';
```

### Transform
```typescript
import { mapKeys, mapValues, compose, pipe } from '@oxog/utils/transform';
```

## Documentation

Full documentation: [https://utils.oxog.dev](https://utils.oxog.dev)

## Features

- ✅ Zero runtime dependencies
- ✅ 100% TypeScript strict mode
- ✅ Full type inference
- ✅ Immutable by default
- ✅ Tree-shakeable
- ✅ Prototype pollution protection
- ✅ LLM-native design

## License

MIT - [Ersin Koç](https://github.com/ersinkoc/utils)
