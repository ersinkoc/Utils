import { CodeBlock } from '@/components/code/CodeBlock';

const exampleCode = `import { get, set, groupBy, camelCase } from '@oxog/utils';

// Object utilities
const user = { name: 'Ersin', address: { city: 'Istanbul' } };
const city = get(user, 'address.city'); // 'Istanbul'
const updated = set(user, 'name', 'Ali'); // new object, immutable

// Array utilities
const users = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' }
];
const grouped = groupBy(users, 'role');
// { admin: [{ id: 1, ... }], user: [{ id: 2, ... }] }

// String utilities
const slug = camelCase('hello-world'); // 'helloWorld'`;

export function QuickExample() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Quick Example</h2>
            <p className="text-muted-foreground">
              Get started in seconds with a simple, intuitive API.
            </p>
          </div>

          <CodeBlock
            code={exampleCode}
            language="typescript"
            filename="example.ts"
          />
        </div>
      </div>
    </section>
  );
}
