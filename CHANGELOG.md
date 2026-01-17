# Changelog

All notable changes to @oxog/utils will be documented in this file.

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
