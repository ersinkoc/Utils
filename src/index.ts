export {
  get,
  set,
  setMut,
  has,
  pick,
  omit,
  merge,
  keys,
  values,
  entries,
  fromEntries
} from './plugins/core/object.js';
export {
  groupBy,
  keyBy,
  chunk,
  uniq,
  uniqBy,
  flatten,
  compact,
  first,
  last,
  sample
} from './plugins/core/array.js';
export {
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  capitalize,
  truncate,
  slugify,
  template
} from './plugins/core/string.js';

export * as object from './plugins/core/object.js';
export * as array from './plugins/core/array.js';
export * as string from './plugins/core/string.js';

export type { Plugin } from './types.js';
export { Kernel } from './kernel.js';
