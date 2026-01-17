import { describe, it, expect } from '@jest/globals';
import {
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  capitalize,
  truncate,
  slugify,
  template,
} from '../src/plugins/core/string.js';

describe('String Utilities', () => {
  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello-world')).toBe('helloWorld');
      expect(camelCase('hello_world')).toBe('helloWorld');
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('Hello World')).toBe('helloWorld');
      expect(camelCase('HelloWorld')).toBe('helloWorld');
    });

    it('should handle empty string', () => {
      expect(camelCase('')).toBe('');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('hello_world')).toBe('hello-world');
      expect(kebabCase('hello world')).toBe('hello-world');
      expect(kebabCase('HelloWorld')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(kebabCase('')).toBe('');
    });
  });

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
      expect(snakeCase('hello-world')).toBe('hello_world');
      expect(snakeCase('hello world')).toBe('hello_world');
      expect(snakeCase('HelloWorld')).toBe('hello_world');
    });

    it('should handle empty string', () => {
      expect(snakeCase('')).toBe('');
    });
  });

  describe('pascalCase', () => {
    it('should convert to PascalCase', () => {
      expect(pascalCase('hello-world')).toBe('HelloWorld');
      expect(pascalCase('hello_world')).toBe('HelloWorld');
      expect(pascalCase('hello world')).toBe('HelloWorld');
      expect(pascalCase('helloWorld')).toBe('HelloWorld');
    });

    it('should handle empty string', () => {
      expect(pascalCase('')).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('hello world')).toBe('Hello world');
      expect(capitalize('HELLO')).toBe('HELLO');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate string', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
      expect(truncate('Hello World', 8)).toBe('Hello Wo...');
    });

    it('should not truncate if short enough', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should use custom suffix', () => {
      expect(truncate('Hello World', 5, '---')).toBe('Hello---');
      expect(truncate('Hello World', 8, ' [more]')).toBe('Hello Wo [more]');
    });
  });

  describe('slugify', () => {
    it('should convert to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Hello  World!')).toBe('hello-world');
    });

    it('should handle Turkish characters', () => {
      expect(slugify('Türkçe Başlık')).toBe('turkce-baslik');
      expect(slugify('Çorum')).toBe('corum');
      expect(slugify('İstanbul')).toBe('istanbul');
    });

    it('should handle Unicode', () => {
      expect(slugify('Café au lait')).toBe('cafe-au-lait');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });
  });

  describe('template', () => {
    it('should interpolate variables', () => {
      expect(template('Hello {{name}}!', { name: 'World' })).toBe('Hello World!');
      expect(template('{{greeting}}, {{name}}!', { greeting: 'Hello', name: 'Alice' })).toBe(
        'Hello, Alice!'
      );
    });

    it('should handle nested objects', () => {
      expect(template('Hello {{user.name}}!', { user: { name: 'Alice' } })).toBe(
        'Hello Alice!'
      );
    });

    it('should handle missing variables', () => {
      expect(template('Hello {{name}}!', {})).toBe('Hello !');
      expect(template('Hello {{user.name}}!', { user: {} })).toBe('Hello !');
    });
  });
});
