import { DebounceOptions, RetryOptions } from '../../types.js';
import { TimeoutError, MaxRetriesExceededError } from '../../errors.js';

interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  cancel: () => void;
  flush: () => ReturnType<T>;
  pending: () => boolean;
}

/**
 * Debounce function execution.
 *
 * Delays function execution until after `wait` milliseconds have elapsed
 * since the last time the debounced function was invoked.
 *
 * @param fn - Function to debounce
 * @param wait - Wait time in milliseconds
 * @param options - Debounce options
 * @returns Debounced function with control methods
 *
 * @example Basic usage
 * ```typescript
 * const debouncedSave = debounce(save, 300);
 * debouncedSave(data);
 * // save() will be called 300ms after last call
 * ```
 *
 * @example With control methods
 * ```typescript
 * const debouncedSave = debounce(save, 300);
 * debouncedSave(data);
 * debouncedSave.cancel(); // Cancel pending execution
 * debouncedSave.flush(); // Execute immediately
 * debouncedSave.pending(); // Check if pending
 * ```
 *
 * @example Leading edge
 * ```typescript
 * const debounced = debounce(fn, 300, { leading: true });
 * debounced(); // Executes immediately on first call
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;
  let result: ReturnType<T>;

  const { leading = false, trailing = true } = options;

  const invoke = () => {
    if (lastArgs) {
      result = fn.apply(lastThis, lastArgs);
      lastArgs = undefined;
      lastThis = undefined;
    }
  };

  const debounced = function (this: any, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;

    const shouldCallLeading = leading && !timeoutId;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (shouldCallLeading) {
      invoke();
    }

    timeoutId = setTimeout(() => {
      if (trailing && !shouldCallLeading) {
        invoke();
      }
      timeoutId = undefined;
    }, wait);
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
    lastArgs = undefined;
    lastThis = undefined;
  };

  debounced.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      invoke();
    }
    return result;
  };

  debounced.pending = () => {
    return timeoutId !== undefined;
  };

  return debounced;
}

/**
 * Throttle function execution.
 *
 * Ensures function is called at most once every `wait` milliseconds.
 *
 * @param fn - Function to throttle
 * @param wait - Wait time in milliseconds
 * @param options - Throttle options
 * @returns Throttled function with control methods
 *
 * @example Basic usage
 * ```typescript
 * const throttledScroll = throttle(onScroll, 100);
 * window.addEventListener('scroll', throttledScroll);
 * // onScroll will be called at most once every 100ms
 * ```
 *
 * @example With control methods
 * ```typescript
 * const throttled = throttle(fn, 100);
 * throttled.cancel(); // Cancel pending execution
 * throttled.pending(); // Check if pending
 * ```
 */
interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  cancel: () => void;
  pending: () => boolean;
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): ThrottledFunction<T> {
  const { leading = true, trailing = true } = options;
  let lastCallTime = Date.now(); // Initialize to current time
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;
  let firstCall = true;

  const throttled = function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastCallTime);

    lastArgs = args;
    lastThis = this;

    if (firstCall) {
      firstCall = false;
      if (leading) {
        // Execute immediately on first call
        lastCallTime = now;
        fn.apply(this, args);
        lastArgs = undefined;
        lastThis = undefined;
      } else if (trailing) {
        // Schedule trailing call
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now();
          if (lastArgs) {
            fn.apply(lastThis, lastArgs);
            lastArgs = undefined;
            lastThis = undefined;
          }
          timeoutId = undefined;
        }, wait);
      }
    } else if (remaining <= 0 || remaining > wait) {
      // Leading edge after throttle period - execute immediately
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }

      lastCallTime = now;
      fn.apply(this, args);
      lastArgs = undefined;
      lastThis = undefined;
    } else if (!timeoutId && trailing) {
      // Trailing edge - schedule execution
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        if (lastArgs) {
          fn.apply(lastThis, lastArgs);
          lastArgs = undefined;
          lastThis = undefined;
        }
        timeoutId = undefined;
      }, remaining);
    }
  } as ThrottledFunction<T>;

  throttled.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
    lastArgs = undefined;
    lastThis = undefined;
  };

  throttled.pending = () => {
    return timeoutId !== undefined;
  };

  return throttled;
}

/**
 * Sleep for specified milliseconds.
 *
 * Returns a promise that resolves after the specified delay.
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 *
 * @example Basic usage
 * ```typescript
 * await sleep(1000); // Wait 1 second
 * console.log('Done!');
 * ```
 *
 * @example In async function
 * ```typescript
 * async function process() {
 *   console.log('Start');
 *   await sleep(1000);
 *   console.log('After 1 second');
 * }
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff.
 *
 * Retries the function until it succeeds or max attempts are reached.
 *
 * @param options - Retry options
 * @returns Promise with function result
 *
 * @example Basic usage
 * ```typescript
 * const result = await retry({
 *   fn: async () => fetchData(),
 *   attempts: 3,
 *   delay: 1000,
 *   backoff: 'exponential'
 * });
 * ```
 *
 * @example With retry condition
 * ```typescript
 * const result = await retry({
 *   fn: async () => fetchData(),
 *   attempts: 5,
 *   retryIf: (error) => error.code === 'ECONNRESET'
 * });
 * ```
 *
 * @example Linear backoff
 * ```typescript
 * const result = await retry({
 *   fn: async () => fetchData(),
 *   attempts: 3,
 *   delay: 1000,
 *   backoff: 'linear'
 * });
 * // Waits 1000ms, 2000ms, 3000ms between retries
 * ```
 */
export async function retry<T>(options: RetryOptions<T>): Promise<T> {
  const { fn, attempts = 3, delay = 1000, backoff = 'exponential', retryIf } = options;

  let lastError: Error | undefined;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (retryIf && !retryIf(lastError)) {
        throw lastError;
      }

      if (i < attempts - 1) {
        let waitTime = delay;

        if (backoff === 'exponential') {
          waitTime = delay * Math.pow(2, i);
        } else if (backoff === 'linear') {
          waitTime = delay * (i + 1);
        }

        await sleep(waitTime);
      }
    }
  }

  throw new MaxRetriesExceededError(attempts);
}

/**
 * Add timeout to a promise.
 *
 * Rejects with TimeoutError if promise doesn't resolve within specified time.
 *
 * @param promise - Promise to add timeout to
 * @param ms - Timeout in milliseconds
 * @returns Promise with timeout
 *
 * @example Basic usage
 * ```typescript
 * const data = await timeout(fetch('/api'), 5000);
 * // Throws TimeoutError if takes > 5 seconds
 * ```
 *
 * @example With error handling
 * ```typescript
 * try {
 *   const data = await timeout(fetch('/api'), 5000);
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     console.error('Request timed out');
 *   } else {
 *     console.error('Request failed:', error);
 *   }
 * }
 * ```
 */
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError(ms));
    }, ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}
