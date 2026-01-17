# TypeScript Examples

This folder contains examples demonstrating TypeScript features in @oxog/utils.

## Topics Covered

- Path inference for object access
- Generic types
- Type guards for type narrowing

## Running Examples

```bash
cd 04-typescript
npx tsx path-inference.ts
npx tsx generics.ts
npx tsx type-guards.ts
```

## Key Concepts

### Path Inference
`get()` provides full autocomplete for nested properties:
```typescript
const user = { name: 'Alice', address: { city: 'Istanbul' } };
const city = get(user, 'address.city');
```

### Type-Safe Object Methods
Alternatives to Object.keys(), Object.values(), etc:
```typescript
const keys = keys(user); // Typed as Array<keyof User>
const values = values(user); // Typed as Array<User[keyof User]>
```

### Type Guards
Narrow types at runtime:
```typescript
if (isArray(data)) {
  data.map(...) // TypeScript knows it's array
}
```

## Related Examples

- [01-basic](../01-basic/) - Basic usage
- [02-plugins](../02-plugins/) - Plugin usage
- [03-error-handling](../03-error-handling/) - Error scenarios
