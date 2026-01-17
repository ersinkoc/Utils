import { DocsLayout } from './DocsLayout';
import { CodeBlock } from '@/components/code/CodeBlock';
import { InstallTabs } from '@/components/common/InstallTabs';

const requirementsCode = `{
  "engines": {
    "node": ">=18"
  }
}`;

const esmCode = `import { get, set, merge } from '@oxog/utils';

const user = { name: 'Ersin' };
const updated = set(user, 'name', 'Ali');`;

const cjsCode = `const { get, set, merge } = require('@oxog/utils');

const user = { name: 'Ersin' };
const updated = set(user, 'name', 'Ali');`;

export default function Installation() {
  return (
    <DocsLayout
      title="Installation"
      description="How to install and set up @oxog/utils in your project."
    >
      <h2 className="text-2xl font-semibold mt-8 mb-4">Package Manager</h2>
      <p className="text-muted-foreground mb-4">
        Install @oxog/utils using your preferred package manager:
      </p>
      <div className="mb-8">
        <InstallTabs />
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Requirements</h2>
      <p className="text-muted-foreground mb-4">
        @oxog/utils requires Node.js 18 or higher:
      </p>
      <CodeBlock code={requirementsCode} language="json" filename="package.json" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">Module Systems</h2>

      <h3 className="text-xl font-semibold mt-6 mb-3">ESM (Recommended)</h3>
      <p className="text-muted-foreground mb-4">
        The library is designed to work best with ES Modules:
      </p>
      <CodeBlock code={esmCode} language="typescript" filename="app.ts" />

      <h3 className="text-xl font-semibold mt-6 mb-3">CommonJS</h3>
      <p className="text-muted-foreground mb-4">
        CommonJS is also supported for legacy projects:
      </p>
      <CodeBlock code={cjsCode} language="javascript" filename="app.js" />

      <h2 className="text-2xl font-semibold mt-8 mb-4">TypeScript</h2>
      <p className="text-muted-foreground mb-4">
        TypeScript definitions are included out of the box. No additional @types packages needed.
        The library is written in TypeScript and provides full type inference.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Bundle Size</h2>
      <p className="text-muted-foreground mb-4">
        The library is fully tree-shakeable. Only the functions you import will be included
        in your final bundle. Each function is independently importable.
      </p>
    </DocsLayout>
  );
}
