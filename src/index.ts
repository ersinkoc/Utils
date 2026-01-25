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
export { Kernel, type PluginState, type KernelOptions } from './kernel.js';
export { EventBus, ScopedEventBus } from './utils/eventBus.js';
export {
  UtilsError,
  InvalidPathError,
  CircularReferenceError,
  TimeoutError,
  PluginAlreadyRegisteredError,
  PluginNotFoundError,
  PluginDependencyMissingError,
  MaxRetriesExceededError,
  CircularDependencyError,
  PluginInitializationError,
  KernelAlreadyInitializedError,
  KernelInitializingError
} from './errors.js';
