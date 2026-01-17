# @oxog/utils - Implementation Tasks

## Overview

This document provides an ordered, numbered task list for implementing `@oxog/utils`. Each task has dependencies and must be completed sequentially.

## Task List

### Phase 1: Foundation

#### Task 1: Create Project Structure
- [ ] Create directory structure as per IMPLEMENTATION.md
- [ ] Create all necessary directories (src, tests, examples, website, mcp-server)
- [ ] Verify directory structure matches specification
- Dependencies: None
- Estimated Time: 10 minutes

#### Task 2: Create Configuration Files
- [ ] Create package.json with all fields (dependencies empty, devDependencies only)
- [ ] Create tsconfig.json with strict mode enabled
- [ ] Create tsup.config.ts with correct entry points
- [ ] Create vitest.config.ts with coverage thresholds
- [ ] Create .gitignore for Node.js projects
- Dependencies: Task 1
- Estimated Time: 15 minutes

#### Task 3: Create GitHub Actions Workflow
- [ ] Create .github/workflows/deploy.yml
- [ ] Configure for GitHub Pages deployment
- [ ] Add build and test steps
- Dependencies: Task 2
- Estimated Time: 10 minutes

### Phase 2: Core Infrastructure

#### Task 4: Implement Type Definitions
- [ ] Create src/types.ts
- [ ] Implement Path<T> type for inference
- [ ] Implement PathValue<T, P> type
- [ ] Add all interface types (Plugin, DebounceOptions, RetryOptions, etc.)
- Dependencies: Task 2
- Estimated Time: 20 minutes

#### Task 5: Implement Error Classes
- [ ] Create src/errors.ts
- [ ] Implement UtilsError base class
- [ ] Implement InvalidPathError
- [ ] Implement CircularReferenceError
- [ ] Implement TimeoutError
- [ ] Implement PluginError (PLUGIN_ALREADY_REGISTERED, PLUGIN_NOT_FOUND, PLUGIN_DEPENDENCY_MISSING)
- Dependencies: Task 4
- Estimated Time: 15 minutes

#### Task 6: Implement Event Bus
- [ ] Create src/utils/eventBus.ts
- [ ] Implement EventBus class with on, off, emit methods
- [ ] Add event listener management
- [ ] Add cleanup functionality
- Dependencies: Task 5
- Estimated Time: 15 minutes

#### Task 7: Implement Micro Kernel
- [ ] Create src/kernel.ts
- [ ] Implement Kernel class with plugin registry
- [ ] Implement register() method with dependency checking
- [ ] Implement init() method for plugin initialization
- [ ] Implement event bus integration
- [ ] Add error handling and recovery
- Dependencies: Task 6
- Estimated Time: 30 minutes

### Phase 3: Core Plugins - Object

#### Task 8: Implement Object Utilities
- [ ] Create src/plugins/core/object.ts
- [ ] Implement get() with path inference
- [ ] Implement set() for immutable updates
- [ ] Implement setMut() for mutable updates
- [ ] Implement has() for path checking
- [ ] Implement pick() for key selection
- [ ] Implement omit() for key exclusion
- [ ] Implement merge() with prototype pollution protection
- [ ] Implement keys() - type-safe Object.keys()
- [ ] Implement values() - type-safe Object.values()
- [ ] Implement entries() - type-safe Object.entries()
- [ ] Implement fromEntries() - type-safe Object.fromEntries()
- [ ] Add JSDoc with @example for all functions
- Dependencies: Task 7
- Estimated Time: 60 minutes

#### Task 9: Test Object Utilities
- [ ] Create tests/unit/plugins/object.test.ts
- [ ] Write comprehensive tests for get() (edge cases, path types, defaults)
- [ ] Write tests for set() (immutability, nested paths)
- [ ] Write tests for setMut() (mutation behavior)
- [ ] Write tests for has() (path existence)
- [ ] Write tests for pick() and omit()
- [ ] Write tests for merge() (prototype pollution, multiple sources)
- [ ] Write tests for keys(), values(), entries(), fromEntries()
- [ ] Verify 100% coverage for object utilities
- Dependencies: Task 8
- Estimated Time: 45 minutes

### Phase 4: Core Plugins - Array

#### Task 10: Implement Array Utilities
- [ ] Create src/plugins/core/array.ts
- [ ] Implement groupBy() with key and function support
- [ ] Implement keyBy() for object indexing
- [ ] Implement chunk() for array splitting
- [ ] Implement uniq() for shallow deduplication
- [ ] Implement uniqBy() for key-based deduplication
- [ ] Implement flatten() with depth parameter
- [ ] Implement compact() for falsy removal
- [ ] Implement first() with n parameter
- [ ] Implement last() with n parameter
- [ ] Implement sample() for random selection
- [ ] Add JSDoc with @example for all functions
- Dependencies: Task 9
- Estimated Time: 45 minutes

#### Task 11: Test Array Utilities
- [ ] Create tests/unit/plugins/array.test.ts
- [ ] Write tests for groupBy() (various key types)
- [ ] Write tests for keyBy()
- [ ] Write tests for chunk() (edge cases)
- [ ] Write tests for uniq() and uniqBy()
- [ ] Write tests for flatten() (various depths)
- [ ] Write tests for compact()
- [ ] Write tests for first() and last()
- [ ] Write tests for sample()
- [ ] Verify 100% coverage for array utilities
- Dependencies: Task 10
- Estimated Time: 40 minutes

### Phase 5: Core Plugins - String

#### Task 12: Implement String Utilities
- [ ] Create src/plugins/core/string.ts
- [ ] Implement camelCase()
- [ ] Implement kebabCase()
- [ ] Implement snakeCase()
- [ ] Implement pascalCase()
- [ ] Implement capitalize()
- [ ] Implement truncate() with custom suffix
- [ ] Implement slugify() with Turkish/Unicode support
- [ ] Implement template() for interpolation
- [ ] Add JSDoc with @example for all functions
- Dependencies: Task 11
- Estimated Time: 40 minutes

#### Task 13: Test String Utilities
- [ ] Create tests/unit/plugins/string.test.ts
- [ ] Write tests for all case conversion functions
- [ ] Write tests for truncate() (edge cases)
- [ ] Write tests for slugify() (Turkish chars, Unicode)
- [ ] Write tests for template() (various data types)
- [ ] Verify 100% coverage for string utilities
- Dependencies: Task 12
- Estimated Time: 30 minutes

### Phase 6: Core Plugin Integration

#### Task 14: Create Core Plugin Index
- [ ] Create src/plugins/core/index.ts
- [ ] Export all object utilities
- [ ] Export all array utilities
- [ ] Export all string utilities
- [ ] Create namespace exports (object, array, string)
- Dependencies: Task 13
- Estimated Time: 10 minutes

#### Task 15: Register Core Plugins
- [ ] Create plugin definitions for object, array, string
- [ ] Register all core plugins with kernel
- [ ] Initialize kernel with core plugins
- [ ] Verify all core functions are available
- Dependencies: Task 14
- Estimated Time: 15 minutes

### Phase 7: Optional Plugins - Deep

#### Task 16: Implement Deep Utilities
- [ ] Create src/plugins/optional/deep.ts
- [ ] Implement cloneDeep() with circular reference handling
- [ ] Implement mergeDeep() with prototype protection
- [ ] Implement isEqual() for deep comparison
- [ ] Implement diff() for object difference
- [ ] Add JSDoc with @example for all functions
- Dependencies: Task 15
- Estimated Time: 60 minutes

#### Task 17: Test Deep Utilities
- [ ] Create tests/unit/plugins/deep.test.ts
- [ ] Write tests for cloneDeep() (circular refs, special types)
- [ ] Write tests for mergeDeep() (nested objects, prototype protection)
- [ ] Write tests for isEqual() (deep equality, special types)
- [ ] Write tests for diff() (various scenarios)
- [ ] Verify 100% coverage for deep utilities
- Dependencies: Task 16
- Estimated Time: 45 minutes

### Phase 8: Optional Plugins - Async

#### Task 18: Implement Async Utilities
- [ ] Create src/plugins/optional/async.ts
- [ ] Implement debounce() with cancel/flush/pending
- [ ] Implement throttle() with leading/trailing
- [ ] Implement sleep()
- [ ] Implement retry() with exponential backoff
- [ ] Implement timeout() with TimeoutError
- [ ] Add JSDoc with @example for all functions
- Dependencies: Task 17
- Estimated Time: 60 minutes

#### Task 19: Test Async Utilities
- [ ] Create tests/unit/plugins/async.test.ts
- [ ] Write tests for debounce() (cancel, flush, pending)
- [ ] Write tests for throttle() (leading, trailing)
- [ ] Write tests for sleep()
- [ ] Write tests for retry() (backoff, max attempts)
- [ ] Write tests for timeout()
- [ ] Verify 100% coverage for async utilities
- Dependencies: Task 18
- Estimated Time: 45 minutes

### Phase 9: Optional Plugins - Guard

#### Task 20: Implement Type Guards
- [ ] Create src/plugins/optional/guard.ts
- [ ] Implement isEmpty() (collections only)
- [ ] Implement isNil()
- [ ] Implement isPlainObject()
- [ ] Implement isArray()
- [ ] Implement isString()
- [ ] Implement isNumber() (excludes NaN)
- [ ] Implement isFunction()
- [ ] Implement isDate()
- [ ] Add JSDoc with @example for all functions
- Dependencies: Task 19
- Estimated Time: 30 minutes

#### Task 21: Test Type Guards
- [ ] Create tests/unit/plugins/guard.test.ts
- [ ] Write tests for isEmpty() (arrays, objects, Map, Set, edge cases)
- [ ] Write tests for isNil()
- [ ] Write tests for isPlainObject() (plain objects vs class instances)
- [ ] Write tests for isArray(), isString(), isNumber(), isFunction(), isDate()
- [ ] Verify 100% coverage for guard utilities
- Dependencies: Task 20
- Estimated Time: 30 minutes

### Phase 10: Optional Plugins - Transform

#### Task 22: Implement Transform Utilities
- [ ] Create src/plugins/optional/transform.ts
- [ ] Implement mapKeys()
- [ ] Implement mapValues()
- [ ] Implement invert()
- [ ] Implement flip()
- [ ] Implement compose() (right-to-left)
- [ ] Implement pipe() (left-to-right)
- [ ] Add JSDoc with @example for all functions
- Dependencies: Task 21
- Estimated Time: 30 minutes

#### Task 23: Test Transform Utilities
- [ ] Create tests/unit/plugins/transform.test.ts
- [ ] Write tests for mapKeys() and mapValues()
- [ ] Write tests for invert()
- [ ] Write tests for flip()
- [ ] Write tests for compose() and pipe()
- [ ] Verify 100% coverage for transform utilities
- Dependencies: Task 22
- Estimated Time: 25 minutes

### Phase 11: Plugin Integration

#### Task 24: Create Optional Plugin Index
- [ ] Create src/plugins/optional/index.ts
- [ ] Export deep plugin entry
- [ ] Export async plugin entry
- [ ] Export guard plugin entry
- [ ] Export transform plugin entry
- Dependencies: Task 23
- Estimated Time: 10 minutes

#### Task 25: Create Main Entry Point
- [ ] Create src/index.ts
- [ ] Export all core functions directly
- [ ] Export all types
- [ ] Export namespace versions (object, array, string)
- [ ] Export Kernel and Plugin for plugin development
- Dependencies: Task 24
- Estimated Time: 15 minutes

#### Task 26: Test Plugin Integration
- [ ] Create tests/integration/full-flow.test.ts
- [ ] Test core plugin loading
- [ ] Test optional plugin loading
- [ ] Test inter-plugin communication
- [ ] Test kernel lifecycle
- [ ] Verify all imports work correctly
- Dependencies: Task 25
- Estimated Time: 30 minutes

### Phase 12: Testing & Coverage

#### Task 27: Write Kernel Tests
- [ ] Create tests/unit/kernel.test.ts
- [ ] Write tests for plugin registration
- [ ] Write tests for dependency checking
- [ ] Write tests for initialization
- [ ] Write tests for error handling
- [ ] Write tests for event bus integration
- [ ] Verify 100% coverage for kernel
- Dependencies: Task 26
- Estimated Time: 30 minutes

#### Task 28: Create Test Fixtures
- [ ] Create tests/fixtures/test-data.ts
- [ ] Add sample objects, arrays, strings for testing
- [ ] Add edge case data
- Dependencies: Task 27
- Estimated Time: 15 minutes

#### Task 29: Run Full Test Suite
- [ ] Run all tests with coverage
- [ ] Verify 100% coverage across all files
- [ ] Fix any coverage gaps
- [ ] Ensure all tests pass
- Dependencies: Task 28
- Estimated Time: 30 minutes

### Phase 13: Build & Type Checking

#### Task 30: TypeScript Compilation
- [ ] Run tsc --noEmit
- [ ] Fix any type errors
- [ ] Verify strict mode compliance
- Dependencies: Task 29
- Estimated Time: 20 minutes

#### Task 31: Build Package
- [ ] Run tsup to build package
- [ ] Verify ESM and CJS outputs
- [ ] Verify type definitions (.d.ts files)
- [ ] Verify source maps
- Dependencies: Task 30
- Estimated Time: 15 minutes

#### Task 32: Test Build Output
- [ ] Test importing from ESM build
- [ ] Test importing from CJS build
- [ ] Test subpath imports (deep, async, guard, transform)
- [ ] Verify tree-shaking works
- Dependencies: Task 31
- Estimated Time: 20 minutes

### Phase 14: Linting & Formatting

#### Task 33: Configure ESLint
- [ ] Create .eslintrc.js
- [ ] Configure TypeScript rules
- [ ] Configure import rules
- Dependencies: Task 32
- Estimated Time: 10 minutes

#### Task 34: Configure Prettier
- [ ] Create .prettierrc
- [ ] Configure formatting rules
- Dependencies: Task 33
- Estimated Time: 5 minutes

#### Task 35: Run Linting
- [ ] Run ESLint on all source files
- [ ] Fix any linting errors
- Dependencies: Task 34
- Estimated Time: 10 minutes

#### Task 36: Run Formatting
- [ ] Run Prettier on all files
- [ ] Verify consistent formatting
- Dependencies: Task 35
- Estimated Time: 10 minutes

### Phase 15: LLM-Native Content

#### Task 37: Create llms.txt
- [ ] Create llms.txt in project root
- [ ] Write package description (< 2000 tokens)
- [ ] Include installation instructions
- [ ] Include API summary by category
- [ ] Include common patterns
- [ ] Include error codes
- [ ] Include GitHub and docs links
- Dependencies: Task 36
- Estimated Time: 30 minutes

#### Task 38: Verify JSDoc Coverage
- [ ] Review all public APIs
- [ ] Verify all have JSDoc comments
- [ ] Verify all have @example tags
- [ ] Verify all have @see tags for related functions
- Dependencies: Task 37
- Estimated Time: 20 minutes

### Phase 16: Examples

#### Task 39: Create Basic Examples
- [ ] Create examples/01-basic/object-access.ts
- [ ] Create examples/01-basic/array-operations.ts
- [ ] Create examples/01-basic/string-transforms.ts
- [ ] Create examples/01-basic/README.md
- Dependencies: Task 38
- Estimated Time: 30 minutes

#### Task 40: Create Plugin Examples
- [ ] Create examples/02-plugins/using-deep.ts
- [ ] Create examples/02-plugins/using-async.ts
- [ ] Create examples/02-plugins/using-guard.ts
- [ ] Create examples/02-plugins/using-transform.ts
- [ ] Create examples/02-plugins/README.md
- Dependencies: Task 39
- Estimated Time: 40 minutes

#### Task 41: Create Error Handling Examples
- [ ] Create examples/03-error-handling/safe-access.ts
- [ ] Create examples/03-error-handling/validation.ts
- [ ] Create examples/03-error-handling/README.md
- Dependencies: Task 40
- Estimated Time: 20 minutes

#### Task 42: Create TypeScript Examples
- [ ] Create examples/04-typescript/path-inference.ts
- [ ] Create examples/04-typescript/generics.ts
- [ ] Create examples/04-typescript/type-guards.ts
- [ ] Create examples/04-typescript/README.md
- Dependencies: Task 41
- Estimated Time: 30 minutes

#### Task 43: Create Integration Examples
- [ ] Create examples/05-integrations/express/
- [ ] Create examples/05-integrations/fastify/
- [ ] Create examples/05-integrations/nestjs/
- [ ] Create examples/05-integrations/trpc/
- [ ] Create examples/05-integrations/prisma/
- [ ] Create examples/05-integrations/README.md
- Dependencies: Task 42
- Estimated Time: 60 minutes

#### Task 44: Create Real-World Examples
- [ ] Create examples/06-real-world/api-response-transform/
- [ ] Create examples/06-real-world/config-merge/
- [ ] Create examples/06-real-world/form-data-process/
- [ ] Create examples/06-real-world/README.md
- Dependencies: Task 43
- Estimated Time: 45 minutes

### Phase 17: Documentation

#### Task 45: Create README.md
- [ ] Create README.md with LLM-optimized first 500 tokens
- [ ] Include package description
- [ ] Include installation instructions
- [ ] Include quick examples
- [ ] Include import patterns
- [ ] Link to full documentation
- Dependencies: Task 44
- Estimated Time: 30 minutes

#### Task 46: Create LICENSE
- [ ] Create LICENSE with MIT license text
- Dependencies: Task 45
- Estimated Time: 5 minutes

#### Task 47: Create CHANGELOG.md
- [ ] Create CHANGELOG.md with version 1.0.0
- [ ] Document all features
- Dependencies: Task 46
- Estimated Time: 15 minutes

### Phase 18: Website

#### Task 48: Initialize Website Project
- [ ] Create website/package.json with React 19, Vite 6
- [ ] Create website/vite.config.ts
- [ ] Create website/tailwind.config.js with v4
- [ ] Create website/index.html
- Dependencies: Task 47
- Estimated Time: 20 minutes

#### Task 49: Install Website Dependencies
- [ ] Install React 19
- [ ] Install Vite 6
- [ ] Install TypeScript
- [ ] Install Tailwind CSS v4
- [ ] Install shadcn/ui
- [ ] Install @oxog/codeshine
- [ ] Install Lucide React
- [ ] Install JetBrains Mono and Inter fonts
- Dependencies: Task 48
- Estimated Time: 15 minutes

#### Task 50: Create Website Components
- [ ] Create website/src/components/Layout.tsx
- [ ] Create website/src/components/Navbar.tsx
- [ ] Create website/src/components/Sidebar.tsx
- [ ] Create website/src/components/Footer.tsx
- [ ] Create website/src/components/CodeBlock.tsx with @oxog/codeshine
- [ ] Create website/src/components/CopyButton.tsx
- [ ] Create website/src/components/ThemeToggle.tsx
- [ ] Create website/src/components/InstallTabs.tsx
- Dependencies: Task 49
- Estimated Time: 90 minutes

#### Task 51: Create Website Pages
- [ ] Create website/src/pages/Home.tsx
- [ ] Create website/src/pages/DocsHome.tsx
- [ ] Create website/src/pages/GettingStarted.tsx
- [ ] Create website/src/pages/ApiReference.tsx
- [ ] Create website/src/pages/Examples.tsx
- [ ] Create website/src/pages/Plugins.tsx
- [ ] Create website/src/pages/Playground.tsx
- Dependencies: Task 50
- Estimated Time: 120 minutes

#### Task 52: Create Website Hooks
- [ ] Create website/src/hooks/useTheme.ts
- [ ] Create website/src/hooks/useClipboard.ts
- Dependencies: Task 51
- Estimated Time: 15 minutes

#### Task 53: Setup Website Routing
- [ ] Create website/src/App.tsx with routing
- [ ] Configure theme provider
- Dependencies: Task 52
- Estimated Time: 20 minutes

#### Task 54: Create Website Public Files
- [ ] Create website/public/CNAME with utils.oxog.dev
- [ ] Copy llms.txt to website/public/
- [ ] Create website/public/favicon.svg
- [ ] Create website/public/og-image.png
- Dependencies: Task 53
- Estimated Time: 15 minutes

#### Task 55: Build and Test Website
- [ ] Run npm run build in website directory
- [ ] Test website locally
- [ ] Verify all pages work
- [ ] Verify theme toggle
- [ ] Verify code highlighting
- Dependencies: Task 54
- Estimated Time: 30 minutes

### Phase 19: MCP Server

#### Task 56: Initialize MCP Server
- [ ] Create mcp-server/package.json
- [ ] Create mcp-server/tsconfig.json
- [ ] Install MCP SDK dependencies
- Dependencies: Task 55
- Estimated Time: 15 minutes

#### Task 57: Implement MCP Tools
- [ ] Create mcp-server/src/tools/search.ts (utils_search_docs)
- [ ] Create mcp-server/src/tools/examples.ts (utils_get_example)
- [ ] Create mcp-server/src/tools/api.ts (utils_api_reference)
- Dependencies: Task 56
- Estimated Time: 60 minutes

#### Task 58: Implement MCP Server
- [ ] Create mcp-server/src/index.ts
- [ ] Register all tools
- [ ] Handle tool invocations
- [ ] Add error handling
- Dependencies: Task 57
- Estimated Time: 30 minutes

#### Task 59: Create MCP Data
- [ ] Create mcp-server/src/data/docs.json
- [ ] Create mcp-server/src/data/examples/ directory
- [ ] Populate with documentation data
- Dependencies: Task 58
- Estimated Time: 45 minutes

#### Task 60: Test MCP Server
- [ ] Test utils_search_docs tool
- [ ] Test utils_get_example tool
- [ ] Test utils_api_reference tool
- Dependencies: Task 59
- Estimated Time: 30 minutes

#### Task 61: Create MCP README
- [ ] Create mcp-server/README.md
- [ ] Document installation and usage
- Dependencies: Task 60
- Estimated Time: 15 minutes

### Phase 20: Final Verification

#### Task 62: Verify Package Build
- [ ] Run npm run build
- [ ] Verify no errors
- [ ] Check output files
- Dependencies: Task 61
- Estimated Time: 10 minutes

#### Task 63: Verify Test Coverage
- [ ] Run npm run test:coverage
- [ ] Verify 100% coverage (lines, branches, functions, statements)
- Dependencies: Task 62
- Estimated Time: 15 minutes

#### Task 64: Verify TypeScript
- [ ] Run npm run typecheck
- [ ] Verify no type errors
- Dependencies: Task 63
- Estimated Time: 10 minutes

#### Task 65: Verify Linting
- [ ] Run npm run lint
- [ ] Verify no linting errors
- Dependencies: Task 64
- Estimated Time: 10 minutes

#### Task 66: Verify Website Build
- [ ] Run npm run build in website directory
- [ ] Verify no errors
- Dependencies: Task 65
- Estimated Time: 10 minutes

#### Task 67: Test All Examples
- [ ] Run all example files
- [ ] Verify they work correctly
- Dependencies: Task 66
- Estimated Time: 30 minutes

#### Task 68: Final Package Verification
- [ ] Verify package.json is complete
- [ ] Verify all exports work
- [ ] Verify all optional imports work
- [ ] Verify bundle sizes meet targets (< 3KB core, < 8KB all)
- Dependencies: Task 67
- Estimated Time: 30 minutes

### Phase 21: Deployment

#### Task 69: Prepare for Release
- [ ] Update version to 1.0.0 in package.json
- [ ] Update CHANGELOG.md
- [ ] Verify all documentation is complete
- Dependencies: Task 68
- Estimated Time: 15 minutes

#### Task 70: Create Git Repository
- [ ] Initialize git repository
- [ ] Create .gitignore (verify it's complete)
- [ ] Create initial commit
- Dependencies: Task 69
- Estimated Time: 10 minutes

#### Task 71: Push to GitHub
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Verify GitHub Actions runs
- Dependencies: Task 70
- Estimated Time: 15 minutes

#### Task 72: Verify GitHub Actions
- [ ] Monitor GitHub Actions workflow
- [ ] Verify tests pass
- [ ] Verify website deploys
- Dependencies: Task 71
- Estimated Time: 30 minutes

#### Task 73: Configure GitHub Pages
- [ ] Configure custom domain (utils.oxog.dev)
- [ ] Verify website is accessible
- Dependencies: Task 72
- Estimated Time: 15 minutes

## Summary

**Total Tasks:** 73
**Estimated Total Time:** ~35 hours

## Completion Criteria

The implementation is complete when:

1. All 73 tasks are marked as complete
2. All tests pass with 100% coverage
3. TypeScript compilation succeeds with no errors
4. ESLint passes with no errors
5. Package builds successfully
6. Website builds and runs correctly
7. MCP server works with all tools
8. All examples run successfully
9. GitHub Actions workflow completes successfully
10. Website is deployed and accessible at utils.oxog.dev

## Next Steps

After completing all tasks:

1. Create a git tag for version 1.0.0
2. Publish to npm: `npm publish`
3. Announce the package
4. Monitor for issues and feedback
