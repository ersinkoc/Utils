# Changelog

All notable changes to @oxog/utils will be documented in this file.

## [1.0.1] - 2026-01-25

### Added
- **Plugin State Tracking**: New `PluginState` type (`registered`, `initializing`, `active`, `error`, `destroyed`)
- **Scoped Event Bus**: Automatic listener cleanup when plugins are unregistered
  - `ScopedEventBus` class for plugin-specific event handling
  - `EventBus.onScoped()`, `EventBus.removeScope()`, `EventBus.hasScope()` methods
- **Kernel Options**: Constructor now accepts `KernelOptions<TContext>` for initial context
- **New API Methods**:
  - `kernel.getPluginState(name)` - Get plugin lifecycle state
  - `kernel.getState()` - Get kernel state (`idle`, `initializing`, `initialized`, `destroyed`)
  - `kernel.isInitialized()` - Check if kernel is initialized
  - `kernel.getScopedEventBus(name)` - Get scoped event bus for a plugin
- **New Error Classes**:
  - `CircularDependencyError` - Thrown when circular dependency detected
  - `PluginInitializationError` - Thrown with cause when plugin init fails
  - `KernelAlreadyInitializedError` - Thrown when kernel already initialized
  - `KernelInitializingError` - Thrown for race condition prevention

### Changed
- **BREAKING**: `kernel.unregister()` is now async and returns `Promise<void>`
- **Topological Sort**: Plugins now initialize in dependency order
- **Rollback Mechanism**: Failed initialization triggers rollback of already-initialized plugins
- **Race Condition Prevention**: Concurrent `init()` calls are now properly handled
- **Late Registration**: Plugins registered after `kernel.init()` are automatically initialized

### Fixed
- Plugins registered after `kernel.init()` now have their `onInit` called
- Event listeners are automatically cleaned up when plugins are unregistered
- Circular dependencies are now detected and throw clear errors
- Partial initialization failures now properly rollback

### Testing
- Added 23 new test cases for Kernel improvements
- Added 8 new test cases for ScopedEventBus
- Added 6 new test cases for new error classes
- Test coverage: 98.36% statements, 100% functions

## [1.0.0] - 2026-01-15

### Added
- Initial release of @oxog/utils
- Object utilities: get, set, setMut, has, pick, omit, merge, keys, values, entries, fromEntries
- Array utilities: groupBy, keyBy, chunk, uniq, uniqBy, flatten, compact, first, last, sample
- String utilities: camelCase, kebabCase, snakeCase, pascalCase, capitalize, truncate, slugify, template
- Deep utilities: cloneDeep, mergeDeep, isEqual, diff
- Async utilities: debounce, throttle, sleep, retry, timeout
- Type guards: isEmpty, isNil, isPlainObject, isArray, isString, isNumber, isFunction, isDate
- Transform utilities: mapKeys, mapValues, invert, flip, compose, pipe
- Full TypeScript support with strict mode
- Zero runtime dependencies
- 100% test coverage
- Micro-kernel plugin architecture
- Prototype pollution protection
- LLM-native design with llms.txt

### Features
- Type-safe path inference for object access
- Circular reference handling in deep operations
- Turkish character support in slugify
- Configurable debounce and throttle
- Exponential backoff for retry
- Immutable by default (with mutable alternatives)
- Tree-shakeable bundles
- ESM + CJS dual output

### Documentation
- Full API documentation
- Usage examples for all functions
- TypeScript examples
- Integration examples for Express, Fastify, NestJS, tRPC, Prisma
- LLM-optimized README

### Testing
- Vitest test suite with 100% coverage
- Unit tests for all functions
- Integration tests
- Mock timers for async utilities
