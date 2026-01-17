# Error Handling Examples

This folder contains examples demonstrating error handling patterns in @oxog/utils.

## Topics Covered

- Safe property access with default values
- Type narrowing with guards
- Validation patterns
- Error recovery

## Running Examples

```bash
cd 03-error-handling
npx tsx safe-access.ts
npx tsx validation.ts
```

## Key Concepts

### Default Values with get()
Use default values to provide fallbacks:
```typescript
const city = get(user, 'address.city', 'Unknown');
```

### Type Guards for Validation
Use type guards to validate input:
```typescript
if (!isPlainObject(data)) {
  throw new Error('Invalid data');
}
```

### Prototype Pollution Protection
All merge operations automatically filter dangerous keys:
```typescript
merge({}, { __proto__: { evil: true } }); // {} - filtered!
```

## Related Examples

- [01-basic](../01-basic/) - Basic usage
- [02-plugins](../02-plugins/) - Plugin usage
- [04-typescript](../04-typescript/) - TypeScript features
