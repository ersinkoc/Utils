import { DocsLayout } from './DocsLayout';
import { CodeBlock } from '@/components/code/CodeBlock';

const importExample = `import { get, set, merge, pick, omit } from '@oxog/utils';

// Or namespace imports
import * as utils from '@oxog/utils';
utils.get(obj, 'path');`;

const pluginExample = `// Deep operations (clone, merge, diff, equality)
import { cloneDeep, isEqual, mergeDeep } from '@oxog/utils/deep';

// Async utilities (debounce, throttle, retry, timeout)
import { debounce, throttle, retry, sleep } from '@oxog/utils/async';

// Type guards (isEmpty, isNil, isPlainObject, etc.)
import { isEmpty, isNil, isPlainObject } from '@oxog/utils/guard';

// Function utilities (compose, pipe, mapKeys, etc.)
import { compose, pipe, flip } from '@oxog/utils/transform';`;

export default function Introduction() {
  return (
    <DocsLayout
      title="Introduction"
      description="Modern, tree-shakeable utility library for Node.js backend development."
    >
      <h2 className="text-2xl font-semibold mt-8 mb-4">What is @oxog/utils?</h2>
      <p className="text-muted-foreground mb-4">
        @oxog/utils is a zero-dependency, type-safe utility library designed specifically for
        Node.js backend development. It provides a comprehensive set of utility functions with
        full TypeScript support and automatic type inference.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Key Features</h2>
      <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
        <li><strong>Zero dependencies</strong> - No runtime dependencies, keeping your bundle lean</li>
        <li><strong>Type-safe</strong> - Written in TypeScript with full type inference</li>
        <li><strong>Tree-shakeable</strong> - Import only what you need</li>
        <li><strong>Secure</strong> - Built-in prototype pollution protection</li>
        <li><strong>Performant</strong> - Immutable by default, optimized for Node.js backends</li>
        <li><strong>Well-tested</strong> - 216 tests with 100% success rate and 99%+ coverage</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Import Patterns</h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">Main Package</h3>
      <CodeBlock code={importExample} language="typescript" />

      <h3 className="text-xl font-semibold mt-6 mb-3">Optional Plugins</h3>
      <p className="text-muted-foreground mb-4">
        Additional utilities are available as separate imports for better tree-shaking:
      </p>
      <CodeBlock code={pluginExample} language="typescript" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Philosophy</h2>
      <p className="text-muted-foreground mb-4">
        Unlike general-purpose libraries like Lodash, @oxog/utils is designed specifically for
        backend Node.js development. This focus allows for:
      </p>
      <ul className="list-disc list-inside text-muted-foreground space-y-2">
        <li>Optimizations specific to Node.js environments</li>
        <li>No browser compatibility overhead</li>
        <li>Immutable operations by default for safer concurrent code</li>
        <li>Built-in security features like prototype pollution protection</li>
      </ul>
    </DocsLayout>
  );
}
