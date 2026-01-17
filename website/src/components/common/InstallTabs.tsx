import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';
import { cn } from '@/lib/utils';
import { NPM_PACKAGE } from '@/lib/constants';

const PACKAGE_MANAGERS = [
  { id: 'npm', label: 'npm', command: `npm install ${NPM_PACKAGE}` },
  { id: 'yarn', label: 'yarn', command: `yarn add ${NPM_PACKAGE}` },
  { id: 'pnpm', label: 'pnpm', command: `pnpm add ${NPM_PACKAGE}` },
  { id: 'bun', label: 'bun', command: `bun add ${NPM_PACKAGE}` },
];

export function InstallTabs() {
  const [activeTab, setActiveTab] = useState('npm');
  const { copied, copy } = useClipboard();
  const activeManager = PACKAGE_MANAGERS.find(pm => pm.id === activeTab)!;

  return (
    <div className="w-full max-w-lg">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {PACKAGE_MANAGERS.map((pm) => (
          <button
            key={pm.id}
            onClick={() => setActiveTab(pm.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              "border-b-2 -mb-px",
              activeTab === pm.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {pm.label}
          </button>
        ))}
      </div>

      {/* Command */}
      <div className="mt-4 relative group">
        <div className="flex items-center justify-between bg-muted/50 rounded-lg border border-border overflow-hidden">
          <code className="px-4 py-3 text-sm font-mono flex-1 overflow-x-auto">
            {activeManager.command}
          </code>
          <button
            onClick={() => copy(activeManager.command)}
            className={cn(
              "p-3 border-l border-border transition-colors",
              "hover:bg-accent"
            )}
            aria-label="Copy command"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
