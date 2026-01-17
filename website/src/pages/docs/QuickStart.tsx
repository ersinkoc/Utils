import { DocsLayout } from './DocsLayout';
import { CodeBlock } from '@/components/code/CodeBlock';

const objectExample = `import { get, set, pick, omit, merge } from '@oxog/utils';

const user = {
  name: 'Ersin',
  address: {
    city: 'Istanbul',
    country: 'Turkey'
  }
};

// Safe nested property access
const city = get(user, 'address.city'); // 'Istanbul'
const zip = get(user, 'address.zip', 'N/A'); // 'N/A' (default value)

// Immutable updates
const updated = set(user, 'address.city', 'Ankara');
// user.address.city is still 'Istanbul'
// updated.address.city is 'Ankara'

// Pick specific keys
const picked = pick(user, ['name']); // { name: 'Ersin' }

// Omit specific keys
const omitted = omit(user, ['address']); // { name: 'Ersin' }

// Safe merge with prototype pollution protection
const merged = merge({}, user, { email: 'ersin@example.com' });`;

const arrayExample = `import { groupBy, chunk, uniq, flatten, compact } from '@oxog/utils';

const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
  { id: 3, name: 'Charlie', role: 'admin' }
];

// Group by property
const byRole = groupBy(users, 'role');
// { admin: [Alice, Charlie], user: [Bob] }

// Chunk array
const chunks = chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]

// Remove duplicates
const unique = uniq([1, 2, 2, 3, 3, 3]);
// [1, 2, 3]

// Flatten nested arrays
const flat = flatten([[1, 2], [3, [4, 5]]]);
// [1, 2, 3, [4, 5]]

// Remove falsy values
const compacted = compact([0, 1, false, 2, '', 3, null]);
// [1, 2, 3]`;

const stringExample = `import { camelCase, kebabCase, snakeCase, slugify, template } from '@oxog/utils';

// Case conversions
camelCase('hello-world');     // 'helloWorld'
kebabCase('helloWorld');      // 'hello-world'
snakeCase('helloWorld');      // 'hello_world'

// URL-safe slugs (supports Turkish/Unicode)
slugify('Merhaba Dunya!');    // 'merhaba-dunya'
slugify('Hello World 123');   // 'hello-world-123'

// String interpolation
const greeting = template('Hello, {{name}}!', { name: 'Ersin' });
// 'Hello, Ersin!'`;

const asyncExample = `import { debounce, throttle, retry, sleep } from '@oxog/utils/async';

// Debounce
const debouncedSearch = debounce(async (query: string) => {
  return await searchAPI(query);
}, 300);

// Throttle
const throttledUpdate = throttle(async () => {
  await updateMetrics();
}, 1000);

// Retry with exponential backoff
const data = await retry({
  fn: () => fetch('https://api.example.com/data'),
  attempts: 3,
  delay: 1000,
  backoff: 'exponential'
});

// Sleep
await sleep(1000); // Wait 1 second`;

export default function QuickStart() {
  return (
    <DocsLayout
      title="Quick Start"
      description="Get up and running with @oxog/utils in minutes."
    >
      <h2 className="text-2xl font-semibold mt-8 mb-4">Object Utilities</h2>
      <p className="text-muted-foreground mb-4">
        Work with objects safely and immutably:
      </p>
      <CodeBlock code={objectExample} language="typescript" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Array Utilities</h2>
      <p className="text-muted-foreground mb-4">
        Powerful array manipulation functions:
      </p>
      <CodeBlock code={arrayExample} language="typescript" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">String Utilities</h2>
      <p className="text-muted-foreground mb-4">
        String transformations and formatting:
      </p>
      <CodeBlock code={stringExample} language="typescript" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Async Utilities</h2>
      <p className="text-muted-foreground mb-4">
        Handle async operations with ease (from @oxog/utils/async plugin):
      </p>
      <CodeBlock code={asyncExample} language="typescript" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Next Steps</h2>
      <ul className="list-disc list-inside text-muted-foreground space-y-2">
        <li>Explore the <a href="/api" className="text-primary hover:underline">API Reference</a> for all available functions</li>
        <li>Check out <a href="/examples" className="text-primary hover:underline">Examples</a> for real-world use cases</li>
        <li>Learn about <a href="/plugins" className="text-primary hover:underline">Plugins</a> for extended functionality</li>
      </ul>
    </DocsLayout>
  );
}
