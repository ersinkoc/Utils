/**
 * Get type at a specific path in an object.
 *
 * Uses path inference to determine the type of value at the given path.
 */
export type PathValue<T, P> = any;

/**
 * Plugin interface for extending kernel functionality.
 *
 * @typeParam TContext - Shared context type between plugins
 */
export interface Plugin<TContext = unknown> {
  /** Unique plugin identifier (kebab-case) */
  name: string;

  /** Semantic version (e.g., "1.0.0") */
  version: string;

  /** Other plugins this plugin depends on */
  dependencies?: string[];

  /**
   * Called when plugin is registered.
   * @param kernel - The kernel instance
   */
  install: (kernel: any) => void;

  /**
   * Called after all plugins are installed.
   * @param context - Shared context object
   */
  onInit?: (context: TContext) => void | Promise<void>;

  /**
   * Called when plugin is unregistered.
   */
  onDestroy?: () => void | Promise<void>;

  /**
   * Called on error in this plugin.
   * @param error - The error that occurred
   */
  onError?: (error: Error) => void;
}

/**
 * Options for get() function.
 */
export interface GetOptions {
  /**
   * Enable strict mode - throws on invalid paths.
   * @default false
   */
  strict?: boolean;
}

/**
 * Options for merge() function.
 */
export interface MergeOptions {
  /**
   * Filter dangerous keys (__proto__, constructor, prototype).
   * @default true
   */
  filterPrototype?: boolean;
}

/**
 * Options for debounce() function.
 */
export interface DebounceOptions {
  /**
   * Invoke on leading edge of timeout.
   * @default false
   */
  leading?: boolean;

  /**
   * Invoke on trailing edge of timeout.
   * @default true
   */
  trailing?: boolean;

  /**
   * Maximum time to wait.
   * @default undefined
   */
  maxWait?: number;
}

/**
 * Options for throttle() function.
 */
export interface ThrottleOptions {
  /**
   * Invoke on leading edge of timeout.
   * @default true
   */
  leading?: boolean;

  /**
   * Invoke on trailing edge of timeout.
   * @default true
   */
  trailing?: boolean;
}

/**
 * Options for retry() function.
 */
export interface RetryOptions<T = any> {
  /**
   * Number of retry attempts.
   * @default 3
   */
  attempts?: number;

  /**
   * Delay between retries in ms.
   * @default 1000
   */
  delay?: number;

  /**
   * Backoff strategy.
   * @default 'exponential'
   */
  backoff?: 'linear' | 'exponential' | 'none';

  /**
   * Condition to retry.
   * @default () => true
   */
  retryIf?: (error: Error) => boolean;

  /**
   * Function to retry.
   */
  fn: () => Promise<T>;
}

/**
 * Result object for diff() function.
 */
export interface DiffResult {
  /** Values that changed */
  changed: Record<string, { from: any; to: any }>;

  /** Values that were added */
  added: Record<string, any>;

  /** Values that were removed */
  removed: Record<string, any>;
}

/**
 * Path type for object property access with autocomplete.
 *
 * Recursively generates string literal types for all possible paths in an object.
 * Supports both dot notation and array notation.
 */
export type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${Path<T[K]>}` | K
          : K
        : never
    }[keyof T]
  : never;
