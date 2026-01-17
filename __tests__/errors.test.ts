import { describe, it, expect } from '@jest/globals';
import {
  UtilsError,
  InvalidPathError,
  CircularReferenceError,
  TimeoutError,
  PluginAlreadyRegisteredError,
  PluginNotFoundError,
  PluginDependencyMissingError,
  MaxRetriesExceededError,
} from '../src/errors.js';

describe('Error Classes', () => {
  describe('UtilsError', () => {
    it('should create base error with code', () => {
      const error = new UtilsError('Test message', 'TEST_CODE');
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('UtilsError');
    });

    it('should have stack trace', () => {
      const error = new UtilsError('Test', 'TEST');
      expect(error.stack).toBeDefined();
    });
  });

  describe('InvalidPathError', () => {
    it('should create error with path in message', () => {
      const error = new InvalidPathError('a.b.c');
      expect(error.message).toBe('Invalid path: a.b.c');
      expect(error.code).toBe('INVALID_PATH');
      expect(error.name).toBe('InvalidPathError');
    });
  });

  describe('CircularReferenceError', () => {
    it('should create error with default message', () => {
      const error = new CircularReferenceError();
      expect(error.message).toBe('Circular reference detected');
      expect(error.code).toBe('CIRCULAR_REF');
      expect(error.name).toBe('CircularReferenceError');
    });
  });

  describe('TimeoutError', () => {
    it('should create error with timeout in message', () => {
      const error = new TimeoutError(5000);
      expect(error.message).toBe('Operation timed out after 5000ms');
      expect(error.code).toBe('TIMEOUT');
      expect(error.name).toBe('TimeoutError');
    });
  });

  describe('PluginAlreadyRegisteredError', () => {
    it('should create error with plugin name in message', () => {
      const error = new PluginAlreadyRegisteredError('test-plugin');
      expect(error.message).toBe('Plugin "test-plugin" already registered');
      expect(error.code).toBe('PLUGIN_ALREADY_REGISTERED');
      expect(error.name).toBe('PluginAlreadyRegisteredError');
    });
  });

  describe('PluginNotFoundError', () => {
    it('should create error with plugin name in message', () => {
      const error = new PluginNotFoundError('test-plugin');
      expect(error.message).toBe('Plugin "test-plugin" not found');
      expect(error.code).toBe('PLUGIN_NOT_FOUND');
      expect(error.name).toBe('PluginNotFoundError');
    });
  });

  describe('PluginDependencyMissingError', () => {
    it('should create error with plugin and dependency in message', () => {
      const error = new PluginDependencyMissingError('plugin-a', 'plugin-b');
      expect(error.message).toBe(
        'Plugin "plugin-a" requires "plugin-b" to be registered first'
      );
      expect(error.code).toBe('PLUGIN_DEPENDENCY_MISSING');
      expect(error.name).toBe('PluginDependencyMissingError');
    });
  });

  describe('MaxRetriesExceededError', () => {
    it('should create error with attempts in message', () => {
      const error = new MaxRetriesExceededError(5);
      expect(error.message).toBe('Maximum retry attempts (5) exceeded');
      expect(error.code).toBe('MAX_RETRIES_EXCEEDED');
      expect(error.name).toBe('MaxRetriesExceededError');
    });
  });

  describe('Error inheritance', () => {
    it('should allow instanceof checks', () => {
      expect(new InvalidPathError('test') instanceof UtilsError).toBe(true);
      expect(new CircularReferenceError() instanceof UtilsError).toBe(true);
      expect(new TimeoutError(100) instanceof UtilsError).toBe(true);
      expect(new PluginAlreadyRegisteredError('test') instanceof UtilsError).toBe(true);
      expect(new PluginNotFoundError('test') instanceof UtilsError).toBe(true);
      expect(
        new PluginDependencyMissingError('a', 'b') instanceof UtilsError
      ).toBe(true);
      expect(new MaxRetriesExceededError(3) instanceof UtilsError).toBe(true);
    });

    it('should allow instanceof checks for specific types', () => {
      expect(new InvalidPathError('test') instanceof InvalidPathError).toBe(true);
      expect(new CircularReferenceError() instanceof CircularReferenceError).toBe(true);
      expect(new TimeoutError(100) instanceof TimeoutError).toBe(true);
      expect(new PluginAlreadyRegisteredError('test') instanceof PluginAlreadyRegisteredError).toBe(
        true
      );
      expect(new PluginNotFoundError('test') instanceof PluginNotFoundError).toBe(true);
      expect(
        new PluginDependencyMissingError('a', 'b') instanceof PluginDependencyMissingError
      ).toBe(true);
      expect(new MaxRetriesExceededError(3) instanceof MaxRetriesExceededError).toBe(true);
    });
  });
});
