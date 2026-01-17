/**
 * Base error class for all @oxog/utils errors.
 */
export class UtilsError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'UtilsError';
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when an invalid path is provided to get/set/has functions.
 */
export class InvalidPathError extends UtilsError {
  constructor(path: string) {
    super(`Invalid path: ${path}`, 'INVALID_PATH');
    this.name = 'InvalidPathError';
  }
}

/**
 * Error thrown when a circular reference is detected during deep operations.
 */
export class CircularReferenceError extends UtilsError {
  constructor() {
    super('Circular reference detected', 'CIRCULAR_REF');
    this.name = 'CircularReferenceError';
  }
}

/**
 * Error thrown when an operation times out.
 */
export class TimeoutError extends UtilsError {
  constructor(ms: number) {
    super(`Operation timed out after ${ms}ms`, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

/**
 * Error thrown when a plugin is already registered.
 */
export class PluginAlreadyRegisteredError extends UtilsError {
  constructor(name: string) {
    super(`Plugin "${name}" already registered`, 'PLUGIN_ALREADY_REGISTERED');
    this.name = 'PluginAlreadyRegisteredError';
  }
}

/**
 * Error thrown when a requested plugin is not found.
 */
export class PluginNotFoundError extends UtilsError {
  constructor(name: string) {
    super(`Plugin "${name}" not found`, 'PLUGIN_NOT_FOUND');
    this.name = 'PluginNotFoundError';
  }
}

/**
 * Error thrown when a plugin dependency is missing.
 */
export class PluginDependencyMissingError extends UtilsError {
  constructor(plugin: string, dependency: string) {
    super(`Plugin "${plugin}" requires "${dependency}" to be registered first`, 'PLUGIN_DEPENDENCY_MISSING');
    this.name = 'PluginDependencyMissingError';
  }
}

/**
 * Error thrown when retry attempts are exhausted.
 */
export class MaxRetriesExceededError extends UtilsError {
  constructor(attempts: number) {
    super(`Maximum retry attempts (${attempts}) exceeded`, 'MAX_RETRIES_EXCEEDED');
    this.name = 'MaxRetriesExceededError';
  }
}
