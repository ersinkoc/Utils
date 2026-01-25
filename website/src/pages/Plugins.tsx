import { Sidebar } from '@/components/layout/Sidebar';
import { CodeBlock } from '@/components/code/CodeBlock';

const deepPluginCode = `import { cloneDeep, mergeDeep, isEqual, diff } from '@oxog/utils/deep';

// Deep clone with circular reference support
const original = { name: 'Alice' };
original.self = original; // circular reference
const cloned = cloneDeep(original); // works!

// Deep merge with prototype pollution protection
const config = mergeDeep(
  { a: { b: { c: 1 } } },
  { a: { b: { d: 2 } } }
);
// { a: { b: { c: 1, d: 2 } } }

// Deep equality comparison
isEqual({ a: [1, 2] }, { a: [1, 2] }); // true

// Get differences between objects
const changes = diff(oldState, newState);`;

const asyncPluginCode = `import { debounce, throttle, retry, sleep, timeout } from '@oxog/utils/async';

// Debounce with leading/trailing options
const search = debounce(fn, 300, { leading: true });

// Throttle API calls
const update = throttle(fn, 1000);

// Retry with backoff
const result = await retry({
  fn: () => fetchAPI(),
  attempts: 3,
  delay: 1000,
  backoff: 'exponential'
});

// Add timeout to any promise
const data = await timeout(fetchAPI(), 5000);

// Sleep utility
await sleep(1000);`;

const guardPluginCode = `import {
  isEmpty, isNil, isPlainObject, isArray,
  isString, isNumber, isFunction, isDate
} from '@oxog/utils/guard';

// Check if collection is empty
isEmpty([]);           // true
isEmpty({});           // true
isEmpty('');           // true
isEmpty([1]);          // false

// Check for null/undefined
isNil(null);           // true
isNil(undefined);      // true
isNil(0);              // false

// Type guards with TypeScript narrowing
if (isString(value)) {
  // value is typed as string here
  console.log(value.toUpperCase());
}

if (isNumber(value)) {
  // value is typed as number (excludes NaN)
  console.log(value.toFixed(2));
}`;

const transformPluginCode = `import { mapKeys, mapValues, invert, compose, pipe, flip } from '@oxog/utils/transform';

// Transform object keys
const obj = { firstName: 'John', lastName: 'Doe' };
const snaked = mapKeys(obj, (key) => snakeCase(key));
// { first_name: 'John', last_name: 'Doe' }

// Transform object values
const prices = { apple: 1, banana: 2 };
const withTax = mapValues(prices, (v) => v * 1.2);
// { apple: 1.2, banana: 2.4 }

// Invert keys and values
const codes = { a: 1, b: 2 };
invert(codes); // { 1: 'a', 2: 'b' }

// Function composition (right-to-left)
const process = compose(format, validate, parse);
const result = process(input);

// Pipeline (left-to-right)
const pipeline = pipe(parse, validate, format);
const result = pipeline(input);`;

const kernelPluginCode = `import { Kernel, type Plugin, type PluginState } from '@oxog/utils';

// Define your application context
interface AppContext {
  db: Database;
  cache: CacheService;
}

// Create kernel with initial context
const kernel = new Kernel<AppContext>({
  context: { db: myDatabase, cache: myCache }
});

// Define a plugin
const loggerPlugin: Plugin<AppContext> = {
  name: 'logger',
  version: '1.0.0',
  dependencies: [], // optional dependencies
  install: (kernel) => {
    // Called immediately when registered
    console.log('Logger plugin installed');
  },
  onInit: async (ctx) => {
    // Called during kernel.init() - can be async
    await ctx.db.connect();
  },
  onDestroy: async () => {
    // Called on unregister - cleanup resources
  },
  onError: (error) => {
    // Handle plugin-specific errors
  }
};

// Register and initialize
kernel.register(loggerPlugin);
await kernel.init();

// Check plugin state
const state: PluginState = kernel.getPluginState('logger');
// 'registered' | 'initializing' | 'active' | 'error' | 'destroyed'

// Late registration (auto-initialized if kernel is ready)
kernel.register(anotherPlugin); // onInit called automatically

// Scoped event bus (auto-cleanup on unregister)
const bus = kernel.getScopedEventBus('logger');
bus.on('user:login', handler); // Removed when plugin unregistered

// Cleanup
await kernel.unregister('logger'); // async, calls onDestroy
await kernel.destroy(); // destroys all plugins`;

const plugins = [
  {
    id: 'deep',
    name: 'Deep Operations',
    import: '@oxog/utils/deep',
    description: 'Deep clone, merge, equality comparison, and diff operations with circular reference support.',
    code: deepPluginCode,
  },
  {
    id: 'async',
    name: 'Async Utilities',
    import: '@oxog/utils/async',
    description: 'Debounce, throttle, retry with backoff, timeout, and sleep utilities for async operations.',
    code: asyncPluginCode,
  },
  {
    id: 'guard',
    name: 'Type Guards',
    import: '@oxog/utils/guard',
    description: 'Type guard functions for runtime type checking with full TypeScript support.',
    code: guardPluginCode,
  },
  {
    id: 'transform',
    name: 'Transform Utilities',
    import: '@oxog/utils/transform',
    description: 'Object and function transformation utilities including composition and pipeline.',
    code: transformPluginCode,
  },
  {
    id: 'kernel',
    name: 'Kernel (Plugin System)',
    import: '@oxog/utils',
    description: 'Micro-kernel for building extensible applications with plugin lifecycle management, dependency resolution, scoped events, and automatic cleanup.',
    code: kernelPluginCode,
  },
];

export default function Plugins() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Plugins</h1>
            <p className="text-xl text-muted-foreground">
              Optional plugins for extended functionality. Import only what you need.
            </p>
          </div>

          <div className="mb-8 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm">
              <strong>Tree-shaking:</strong> Each plugin is a separate entry point.
              Only the functions you import will be included in your bundle.
            </p>
          </div>

          {plugins.map((plugin) => (
            <section key={plugin.id} id={plugin.id} className="mb-12">
              <h2 className="text-2xl font-semibold mb-2">{plugin.name}</h2>
              <p className="text-muted-foreground mb-4">{plugin.description}</p>
              <div className="mb-4">
                <code className="text-sm bg-muted px-3 py-1.5 rounded font-mono">
                  import {'{ ... }'} from '{plugin.import}'
                </code>
              </div>
              <CodeBlock
                code={plugin.code}
                language="typescript"
                filename={`${plugin.id}-plugin.ts`}
              />
            </section>
          ))}

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Plugin Architecture</h2>
            <p className="text-muted-foreground mb-4">
              Plugins are organized to optimize bundle size:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Core package:</strong> Essential utilities always available</li>
              <li><strong>Optional plugins:</strong> Import separately as needed</li>
              <li><strong>No side effects:</strong> Pure functions, no global state</li>
              <li><strong>Independent:</strong> Plugins don't depend on each other</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
