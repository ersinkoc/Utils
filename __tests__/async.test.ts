import { describe, it, expect, jest } from '@jest/globals';
import {
  debounce,
  throttle,
  sleep,
  retry,
  timeout,
} from '../src/plugins/optional/async.js';
import { TimeoutError, MaxRetriesExceededError } from '../src/errors.js';

describe('Async Utilities', () => {
  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', async () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 300);

      debounced();
      debounced();
      debounced();

      jest.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should support cancel', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 300);

      debounced();
      debounced.cancel();

      jest.advanceTimersByTime(300);
      expect(fn).not.toHaveBeenCalled();
    });

    it('should support flush', () => {
      const fn = jest.fn(() => 'result');
      const debounced = debounce(fn, 300);

      debounced();
      const result = debounced.flush();

      expect(result).toBe('result');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should support pending', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 300);

      expect(debounced.pending()).toBe(false);

      debounced();
      expect(debounced.pending()).toBe(true);

      jest.advanceTimersByTime(300);
      expect(debounced.pending()).toBe(false);
    });

    it('should support leading edge', () => {
      const fn = jest.fn();
      const debounced = debounce(fn, 300, { leading: true });

      debounced();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should throttle function calls', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttled();
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should support cancel', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled.cancel();

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1); // First call executed
    });

    it('should support pending', () => {
      const fn = jest.fn();
      const throttled = throttle(fn, 100);

      expect(throttled.pending()).toBe(false);

      throttled();
      throttled(); // Triggers pending
      expect(throttled.pending()).toBe(true);

      jest.advanceTimersByTime(100);
      expect(throttled.pending()).toBe(false);
    });
  });

  describe('sleep', () => {
    it('should resolve after specified time', async () => {
      jest.useRealTimers();
      const start = Date.now();
      await sleep(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(100);
    });
  });

  describe('retry', () => {
    it('should retry on failure', async () => {
      jest.useRealTimers();
      let attempts = 0;
      const fn = jest.fn(async () => {
        attempts++;
        if (attempts < 3) throw new Error('Failed');
        return 'success';
      });

      const result = await retry({ fn, attempts: 3, delay: 10, backoff: 'none' });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff', async () => {
      jest.useRealTimers();
      const fn = jest.fn(async () => {
        throw new Error('Failed');
      });

      const start = Date.now();
      try {
        await retry({ fn, attempts: 3, delay: 100, backoff: 'exponential' });
      } catch (e) {
        // Expected
      }
      const elapsed = Date.now() - start;
      // Should wait 100ms + 200ms = 300ms minimum
      expect(elapsed).toBeGreaterThanOrEqual(300);
    });

    it('should use linear backoff', async () => {
      jest.useRealTimers();
      const fn = jest.fn(async () => {
        throw new Error('Failed');
      });

      const start = Date.now();
      try {
        await retry({ fn, attempts: 3, delay: 100, backoff: 'linear' });
      } catch (e) {
        // Expected
      }
      const elapsed = Date.now() - start;
      // Should wait 100ms + 200ms = 300ms minimum
      expect(elapsed).toBeGreaterThanOrEqual(300);
    });

    it('should support retryIf condition', async () => {
      jest.useRealTimers();
      const retryableError = new Error('Retryable');
      (retryableError as any).code = 'ECONNRESET';

      const fn = jest.fn(async () => {
        throw retryableError;
      });

      // Should retry 3 times then throw MaxRetriesExceededError
      await expect(
        retry({ fn, attempts: 3, delay: 10, retryIf: (e) => (e as any).code === 'ECONNRESET' })
      ).rejects.toThrow(MaxRetriesExceededError);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw MaxRetriesExceededError', async () => {
      jest.useRealTimers();
      const fn = jest.fn(async () => {
        throw new Error('Failed');
      });

      await expect(retry({ fn, attempts: 3, delay: 10, backoff: 'none' })).rejects.toThrow(
        MaxRetriesExceededError
      );
    });

    it('should not retry if retryIf returns false', async () => {
      jest.useRealTimers();
      const error = new Error('Non-retryable');
      const fn = jest.fn(async () => {
        throw error;
      });

      await expect(
        retry({
          fn,
          attempts: 5,
          delay: 10,
          retryIf: () => false,
        })
      ).rejects.toThrow(error);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('timeout', () => {
    it('should resolve before timeout', async () => {
      jest.useRealTimers();
      const promise = Promise.resolve('success');
      const result = await timeout(promise, 1000);
      expect(result).toBe('success');
    });

    it('should throw TimeoutError after timeout', async () => {
      jest.useRealTimers();
      const promise = new Promise((resolve) => setTimeout(resolve, 1000));
      await expect(timeout(promise, 100)).rejects.toThrow(TimeoutError);
    });

    it('should propagate original error', async () => {
      jest.useRealTimers();
      const promise = Promise.reject(new Error('Original error'));
      await expect(timeout(promise, 1000)).rejects.toThrow('Original error');
    });
  });
});
