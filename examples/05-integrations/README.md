# Framework Integration Examples

This folder contains examples demonstrating @oxog/utils integration with popular frameworks.

## Frameworks Covered

### Express
Middleware and route handler examples:
- Request data transformation
- Response formatting
- Error handling

### Fastify
Plugin and hook examples:
- Request validation
- Response decoration
- Custom types

### NestJS
Service and decorator examples:
- Service injection
- DTO transformation
- Guard usage

### tRPC
Router and procedure examples:
- Input validation
- Output transformation
- Type-safe routes

### Prisma
Data manipulation examples:
- Query result transformation
- Data validation
- Type-safe operations

## Running Examples

```bash
cd 05-integrations/express
npx tsx example.ts

cd 05-integrations/fastify
npx tsx example.ts

cd 05-integrations/nestjs
npx tsx example.ts

cd 05-integrations/trpc
npx tsx example.ts

cd 05-integrations/prisma
npx tsx example.ts
```

## Common Patterns

### Middleware Pattern
```typescript
import { pick } from '@oxog/utils';

app.use((req, res, next) => {
  const safeData = pick(req.body, ['name', 'email']);
  req.body = safeData;
  next();
});
```

### Service Pattern
```typescript
import { mapValues, isEmpty } from '@oxog/utils';

@Injectable()
class UserService {
  async getAll() {
    const users = await this.repo.findMany();
    return mapValues(users, (u) => pick(u, ['id', 'name']));
  }
}
```

### Type-Safe Routes
```typescript
import { get, set } from '@oxog/utils';

export const userRouter = router({
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await db.users.findUnique({ where: { id: input.id } });
      return pick(user, ['id', 'name', 'email']);
    })
});
```

## Related Examples

- [01-basic](../01-basic/) - Basic usage
- [02-plugins](../02-plugins/) - Plugin usage
- [06-real-world](../06-real-world/) - Practical use cases
