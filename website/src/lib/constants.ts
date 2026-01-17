export const PACKAGE_NAME = '@oxog/utils';
export const PACKAGE_SHORT_NAME = 'utils';
export const GITHUB_REPO = 'ersinkoc/utils';
export const NPM_PACKAGE = '@oxog/utils';
export const VERSION = '1.0.0';
export const DESCRIPTION = 'Zero-dependency, type-safe utility functions for Node.js backends';
export const DOMAIN = 'utils.oxog.dev';
export const AUTHOR = 'Ersin KOC';
export const AUTHOR_GITHUB = 'https://github.com/ersinkoc';

export const NAV_ITEMS = [
  { label: 'Docs', href: '/docs' },
  { label: 'API', href: '/api' },
  { label: 'Examples', href: '/examples' },
  { label: 'Plugins', href: '/plugins' },
];

export const DOCS_NAV = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Introduction', href: '/docs/introduction' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Quick Start', href: '/docs/quick-start' },
    ],
  },
  {
    title: 'Core Utilities',
    items: [
      { label: 'Object Utilities', href: '/api#object-utilities' },
      { label: 'Array Utilities', href: '/api#array-utilities' },
      { label: 'String Utilities', href: '/api#string-utilities' },
    ],
  },
  {
    title: 'Plugins',
    items: [
      { label: 'Deep Operations', href: '/plugins#deep' },
      { label: 'Async Utilities', href: '/plugins#async' },
      { label: 'Type Guards', href: '/plugins#guard' },
      { label: 'Transform', href: '/plugins#transform' },
    ],
  },
];

export const FEATURES = [
  {
    icon: 'Package',
    title: 'Zero Dependencies',
    description: 'No runtime dependencies. Lightweight and secure.',
  },
  {
    icon: 'Shield',
    title: 'Type-Safe',
    description: 'Full TypeScript support with automatic type inference.',
  },
  {
    icon: 'TreeDeciduous',
    title: 'Tree-Shakeable',
    description: 'Import only what you need. Optimized bundle size.',
  },
  {
    icon: 'Lock',
    title: 'Secure',
    description: 'Built-in prototype pollution protection.',
  },
  {
    icon: 'Zap',
    title: 'Performant',
    description: 'Immutable by default. Optimized for Node.js backends.',
  },
  {
    icon: 'TestTube',
    title: 'Well-Tested',
    description: '216 tests with 100% success rate and 99%+ coverage.',
  },
];

export const STATS = [
  { label: 'Zero', sublabel: 'Dependencies' },
  { label: '216', sublabel: 'Tests Passed' },
  { label: '99%+', sublabel: 'Coverage' },
  { label: '100%', sublabel: 'TypeScript' },
];
