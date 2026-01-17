import { Sidebar } from '@/components/layout/Sidebar';
import { CodeBlock } from '@/components/code/CodeBlock';

const basicObjectExample = `import { get, set, pick, omit } from '@oxog/utils';

// Configuration object
const config = {
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      user: 'admin',
      password: 'secret'
    }
  },
  cache: {
    enabled: true,
    ttl: 3600
  }
};

// Safe access to nested values
const dbHost = get(config, 'database.host'); // 'localhost'
const redisHost = get(config, 'redis.host', 'localhost'); // 'localhost' (default)

// Immutable updates
const updatedConfig = set(config, 'database.port', 5433);
console.log(config.database.port); // Still 5432
console.log(updatedConfig.database.port); // 5433

// Extract only what you need
const dbConfig = pick(config.database, ['host', 'port']);
// { host: 'localhost', port: 5432 }

// Remove sensitive data
const safeConfig = omit(config.database, ['credentials']);
// { host: 'localhost', port: 5432 }`;

const arrayExample = `import { groupBy, keyBy, chunk, uniqBy } from '@oxog/utils';

const orders = [
  { id: 1, userId: 'u1', status: 'pending', total: 100 },
  { id: 2, userId: 'u2', status: 'completed', total: 250 },
  { id: 3, userId: 'u1', status: 'completed', total: 75 },
  { id: 4, userId: 'u3', status: 'pending', total: 300 },
];

// Group orders by status
const byStatus = groupBy(orders, 'status');
// {
//   pending: [{ id: 1, ... }, { id: 4, ... }],
//   completed: [{ id: 2, ... }, { id: 3, ... }]
// }

// Index by ID for quick lookup
const ordersById = keyBy(orders, 'id');
// { 1: { id: 1, ... }, 2: { id: 2, ... }, ... }

// Process in batches
const batches = chunk(orders, 2);
// [[order1, order2], [order3, order4]]

// Get unique users
const uniqueUsers = uniqBy(orders, 'userId');
// [{ userId: 'u1', ... }, { userId: 'u2', ... }, { userId: 'u3', ... }]`;

const asyncExample = `import { retry, debounce, throttle, sleep } from '@oxog/utils/async';

// Retry failed API calls with exponential backoff
async function fetchWithRetry(url: string) {
  return await retry({
    fn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed');
      return response.json();
    },
    attempts: 3,
    delay: 1000,
    backoff: 'exponential', // 1s, 2s, 4s
    onRetry: (error, attempt) => {
      console.log(\`Retry \${attempt}: \${error.message}\`);
    }
  });
}

// Debounce search input
const searchAPI = debounce(async (query: string) => {
  const results = await fetch(\`/api/search?q=\${query}\`);
  return results.json();
}, 300);

// Throttle metrics updates
const updateMetrics = throttle(async (data: MetricData) => {
  await metricsService.push(data);
}, 1000);

// Sequential processing with delays
async function processItems(items: Item[]) {
  for (const item of items) {
    await processItem(item);
    await sleep(100); // Rate limiting
  }
}`;

const deepExample = `import { cloneDeep, mergeDeep, isEqual, diff } from '@oxog/utils/deep';

const original = {
  users: [
    { id: 1, name: 'Alice', settings: { theme: 'dark' } }
  ],
  config: {
    api: { url: 'https://api.example.com' }
  }
};

// Deep clone - no shared references
const cloned = cloneDeep(original);
cloned.users[0].name = 'Bob';
console.log(original.users[0].name); // Still 'Alice'

// Deep merge configurations
const defaults = {
  api: { timeout: 5000, retries: 3 },
  cache: { enabled: true }
};
const userConfig = {
  api: { timeout: 10000 }
};
const finalConfig = mergeDeep(defaults, userConfig);
// { api: { timeout: 10000, retries: 3 }, cache: { enabled: true } }

// Compare objects deeply
const a = { x: 1, y: { z: 2 } };
const b = { x: 1, y: { z: 2 } };
console.log(isEqual(a, b)); // true

// Get differences between objects
const changes = diff(
  { name: 'Alice', age: 30 },
  { name: 'Alice', age: 31, email: 'alice@example.com' }
);
// { age: { from: 30, to: 31 }, email: { from: undefined, to: 'alice@example.com' } }`;

export default function Examples() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Examples</h1>
            <p className="text-xl text-muted-foreground">
              Real-world examples showing @oxog/utils in action.
            </p>
          </div>

          {/* Basic Object Operations */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Configuration Management</h2>
            <p className="text-muted-foreground mb-4">
              Working with nested configuration objects safely and immutably:
            </p>
            <CodeBlock
              code={basicObjectExample}
              language="typescript"
              filename="config-example.ts"
            />
          </section>

          {/* Array Operations */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Data Processing</h2>
            <p className="text-muted-foreground mb-4">
              Processing arrays of data efficiently:
            </p>
            <CodeBlock
              code={arrayExample}
              language="typescript"
              filename="data-processing.ts"
            />
          </section>

          {/* Async Operations */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Async Operations</h2>
            <p className="text-muted-foreground mb-4">
              Handling async operations with retry, debounce, and throttle:
            </p>
            <CodeBlock
              code={asyncExample}
              language="typescript"
              filename="async-example.ts"
            />
          </section>

          {/* Deep Operations */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Deep Operations</h2>
            <p className="text-muted-foreground mb-4">
              Working with deeply nested objects:
            </p>
            <CodeBlock
              code={deepExample}
              language="typescript"
              filename="deep-example.ts"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
