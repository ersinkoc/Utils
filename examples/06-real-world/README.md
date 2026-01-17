# Real-World Examples

This folder contains practical use case examples for @oxog/utils.

## Use Cases Covered

### API Response Transform
- Filtering sensitive data
- Renaming fields
- Deep merging with defaults

### Config Merge
- Environment-specific configuration
- Deep merging of config objects
- Type-safe config access

### Form Data Process
- Field renaming
- Value transformation
- Validation patterns

## Running Examples

```bash
cd 06-real-world/api-response-transform
npx tsx example.ts

cd 06-real-world/config-merge
npx tsx example.ts

cd 06-real-world/form-data-process
npx tsx example.ts
```

## Common Patterns

### API Response
```typescript
import { pick, omit } from '@oxog/utils';

const sanitizeUser = (user: User) =>
  pick(user, ['id', 'name', 'email']);

const hidePassword = (user: User) =>
  omit(user, ['password', 'secret']);
```

### Config Management
```typescript
import { mergeDeep, get } from '@oxog/utils';

const config = mergeDeep(
  { api: { timeout: 5000 } },
  { api: { timeout: 10000, retries: 3 } }
);

const timeout = get(config, 'api.timeout');
```

### Form Processing
```typescript
import { mapKeys, mapValues, isEmpty } from '@oxog/utils';

const transformForm = (formData: Record<string, string>) => {
  const kebabKeys = mapKeys(formData, kebabCase);
  const trimmed = mapValues(kebabKeys, (v) => v.trim());

  return trimmed;
};
```

## Related Examples

- [01-basic](../01-basic/) - Basic usage
- [02-plugins](../02-plugins/) - Plugin usage
- [05-integrations](../05-integrations/) - Framework integrations
