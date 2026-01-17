# Optional Plugin Usage Examples

This folder contains examples for @oxog/utils optional plugins.

## Files

### using-deep.ts
Demonstrates deep object operations:
- `cloneDeep()` - Deep cloning with circular reference handling
- `mergeDeep()` - Deep merging with prototype pollution protection
- `isEqual()` - Deep equality comparison
- `diff()` - Object difference detection

### using-async.ts
Demonstrates async utilities:
- `debounce()` - Delayed execution with cancel/flush/pending
- `throttle()` - Rate-limited execution
- `sleep()` - Promise-based delay
- `retry()` - Retry with exponential backoff
- `timeout()` - Promise timeout with TimeoutError

### using-guard.ts
Demonstrates type guards:
- `isEmpty()` - Collection emptiness check
- `isNil()` - Null/undefined check
- `isPlainObject()` - Plain object detection
- `isArray()` - Array type guard
- `isString()` - String type guard
- `isNumber()` - Number type guard (excludes NaN)
- `isFunction()` - Function type guard
- `isDate()` - Date type guard

### using-transform.ts
Demonstrates transformation utilities:
- `mapKeys()` - Transform object keys
- `mapValues()` - Transform object values
- `invert()` - Swap keys and values
- `flip()` - Flip function argument order
- `compose()` - Right-to-left function composition
- `pipe()` - Left-to-right function composition

## Running Examples

```bash
# Run all examples
cd 02-plugins
npx tsx using-deep.ts
npx tsx using-async.ts
npx tsx using-guard.ts
npx tsx using-transform.ts
```

## Import Patterns

```typescript
// Import from subpath (recommended for tree-shaking)
import { cloneDeep, isEqual } from '@oxog/utils/deep';
import { debounce, retry } from '@oxog/utils/async';
import { isEmpty, isNil } from '@oxog/utils/guard';
import { mapKeys, pipe } from '@oxog/utils/transform';
```

## Key Differences from Core

### Deep Plugin
- Handles circular references in cloneDeep
- Recursive comparison in isEqual
- Deep merging with conflict resolution

### Async Plugin
- Control methods (cancel, flush, pending)
- Configurable retry strategies (linear, exponential, none)
- Custom retry conditions

### Guard Plugin
- `isEmpty()` ONLY for collections (not like lodash!)
- `isNumber()` excludes NaN
- `isPlainObject()` detects only plain objects, not class instances

### Transform Plugin
- `pipe()` for readable left-to-right pipelines
- `compose()` for functional style right-to-left
- `flip()` for argument reordering

## Related Examples

- [01-basic](../01-basic/) - Core function usage
- [03-error-handling](../03-error-handling/) - Error scenarios
- [04-typescript](../04-typescript/) - TypeScript features
