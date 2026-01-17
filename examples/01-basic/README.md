# Basic Usage Examples

This folder contains basic usage examples for @oxog/utils core functions.

## Files

### object-access.ts
Demonstrates object manipulation utilities:
- `get()` - Safe property access with defaults
- `set()` - Immutable property setting
- `setMut()` - Mutable property setting
- `has()` - Path existence checking
- `pick()` - Select specific keys
- `omit()` - Exclude specific keys
- `merge()` - Safe object merging with prototype pollution protection

### array-operations.ts
Demonstrates array transformation utilities:
- `groupBy()` - Group items by property or function
- `keyBy()` - Index items by property
- `chunk()` - Split arrays into chunks
- `uniq()` - Remove duplicate values
- `uniqBy()` - Remove duplicates by key
- `flatten()` - Flatten nested arrays
- `compact()` - Remove falsy values
- `first()` - Get first n elements
- `last()` - Get last n elements
- `sample()` - Get random samples

### string-transforms.ts
Demonstrates string manipulation utilities:
- `camelCase()` - Convert to camelCase
- `kebabCase()` - Convert to kebab-case
- `snakeCase()` - Convert to snake_case
- `pascalCase()` - Convert to PascalCase
- `capitalize()` - Capitalize first letter
- `truncate()` - Truncate with custom suffix
- `slugify()` - URL-safe slugs with Turkish support
- `template()` - String interpolation

## Running Examples

```bash
# Run all examples
cd 01-basic
npx tsx object-access.ts
npx tsx array-operations.ts
npx tsx string-transforms.ts
```

## Key Concepts

### Immutability by Default
- `set()` creates new objects without modifying originals
- Use `setMut()` only when mutation is intentional

### Type Safety
- Full TypeScript inference for paths and return types
- Type-safe alternatives to Object.keys(), Object.values(), etc.

### Prototype Pollution Protection
- All merge functions filter dangerous keys
- Automatic protection against `__proto__`, `constructor`, `prototype`

### Nullish Semantics
- `get()` uses nullish coalescing for defaults
- Falsy values (0, '', false) are not replaced with defaults

## Related Examples

- [02-plugins](../02-plugins/) - Optional plugin usage
- [03-error-handling](../03-error-handling/) - Error scenarios
- [04-typescript](../04-typescript/) - TypeScript features
