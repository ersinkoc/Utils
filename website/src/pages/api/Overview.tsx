import { Sidebar } from '@/components/layout/Sidebar';
import { CodeBlock } from '@/components/code/CodeBlock';

const objectFunctions = [
  { name: 'get(obj, path, defaultValue?)', description: 'Safe nested property access with type inference' },
  { name: 'set(obj, path, value)', description: 'Immutable property setter' },
  { name: 'setMut(obj, path, value)', description: 'Mutable property setter' },
  { name: 'has(obj, path)', description: 'Check if path exists in object' },
  { name: 'pick(obj, keys)', description: 'Create object with specified keys' },
  { name: 'omit(obj, keys)', description: 'Create object excluding specified keys' },
  { name: 'merge(target, ...sources)', description: 'Safe shallow merge with prototype pollution protection' },
  { name: 'keys(obj)', description: 'Type-safe Object.keys()' },
  { name: 'values(obj)', description: 'Type-safe Object.values()' },
  { name: 'entries(obj)', description: 'Type-safe Object.entries()' },
  { name: 'fromEntries(entries)', description: 'Type-safe Object.fromEntries()' },
];

const arrayFunctions = [
  { name: 'groupBy(arr, key)', description: 'Group array items by property or function' },
  { name: 'keyBy(arr, key)', description: 'Index array by property value' },
  { name: 'chunk(arr, size)', description: 'Split array into chunks' },
  { name: 'uniq(arr)', description: 'Remove duplicate values' },
  { name: 'uniqBy(arr, key)', description: 'Remove duplicates by key' },
  { name: 'flatten(arr, depth?)', description: 'Flatten nested arrays' },
  { name: 'compact(arr)', description: 'Remove falsy values' },
  { name: 'first(arr, n?)', description: 'Get first n elements' },
  { name: 'last(arr, n?)', description: 'Get last n elements' },
  { name: 'sample(arr, n?)', description: 'Get random sample(s)' },
];

const stringFunctions = [
  { name: 'camelCase(str)', description: 'Convert to camelCase' },
  { name: 'kebabCase(str)', description: 'Convert to kebab-case' },
  { name: 'snakeCase(str)', description: 'Convert to snake_case' },
  { name: 'pascalCase(str)', description: 'Convert to PascalCase' },
  { name: 'capitalize(str)', description: 'Capitalize first letter' },
  { name: 'truncate(str, length, suffix?)', description: 'Truncate string to length' },
  { name: 'slugify(str)', description: 'URL-safe slug with Turkish/Unicode support' },
  { name: 'template(str, data)', description: 'String interpolation with {{variable}}' },
];

const getExample = `import { get } from '@oxog/utils';

interface User {
  profile?: {
    name: string;
    settings?: {
      theme: 'light' | 'dark';
    };
  };
}

const user: User = { profile: { name: 'Ersin' } };

// TypeScript infers return type automatically
const theme = get(user, 'profile.settings.theme');
// Type: 'light' | 'dark' | undefined

const name = get(user, 'profile.name');
// Type: string | undefined

// With default value
const defaultTheme = get(user, 'profile.settings.theme', 'light');
// Type: 'light' | 'dark'`;

export default function APIOverview() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">API Reference</h1>
            <p className="text-xl text-muted-foreground">
              Complete reference for all @oxog/utils functions.
            </p>
          </div>

          {/* Object Utilities */}
          <section id="object-utilities" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Object Utilities</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Function</th>
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {objectFunctions.map((fn) => (
                    <tr key={fn.name} className="border-b border-border">
                      <td className="py-3 px-4">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {fn.name}
                        </code>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{fn.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Array Utilities */}
          <section id="array-utilities" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Array Utilities</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Function</th>
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {arrayFunctions.map((fn) => (
                    <tr key={fn.name} className="border-b border-border">
                      <td className="py-3 px-4">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {fn.name}
                        </code>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{fn.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* String Utilities */}
          <section id="string-utilities" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">String Utilities</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Function</th>
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {stringFunctions.map((fn) => (
                    <tr key={fn.name} className="border-b border-border">
                      <td className="py-3 px-4">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                          {fn.name}
                        </code>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{fn.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Example */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Example: Type-Safe get()</h2>
            <p className="text-muted-foreground mb-4">
              The get() function provides type-safe nested property access with automatic type inference:
            </p>
            <CodeBlock code={getExample} language="typescript" filename="example.ts" />
          </section>
        </div>
      </div>
    </div>
  );
}
