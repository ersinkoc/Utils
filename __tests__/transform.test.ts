import { describe, it, expect } from '@jest/globals';
import {
  mapKeys,
  mapValues,
  invert,
  flip,
  compose,
  pipe,
} from '../src/plugins/optional/transform.js';

describe('Transform Utilities', () => {
  describe('mapKeys', () => {
    it('should transform object keys', () => {
      const result = mapKeys({ a: 1, b: 2 }, (key) => key.toUpperCase());
      expect(result).toEqual({ A: 1, B: 2 });
    });

    it('should add prefix', () => {
      const result = mapKeys({ name: 'Alice', age: 30 }, (key) => `user_${key}`);
      expect(result).toEqual({ user_name: 'Alice', user_age: 30 });
    });

    it('should handle empty object', () => {
      expect(mapKeys({}, (key) => key.toUpperCase())).toEqual({});
    });
  });

  describe('mapValues', () => {
    it('should transform object values', () => {
      const result = mapValues({ a: 1, b: 2 }, (val) => val * 2);
      expect(result).toEqual({ a: 2, b: 4 });
    });

    it('should transform with key access', () => {
      const result = mapValues({ a: 1, b: 2 }, (val, key) => `${key}:${val}`);
      expect(result).toEqual({ a: 'a:1', b: 'b:2' });
    });

    it('should handle empty object', () => {
      expect(mapValues({}, (val) => val * 2)).toEqual({});
    });
  });

  describe('invert', () => {
    it('should swap keys and values', () => {
      expect(invert({ a: '1', b: '2', c: '3' })).toEqual({
        '1': 'a',
        '2': 'b',
        '3': 'c',
      });
    });

    it('should handle number values', () => {
      expect(invert({ a: 1, b: 2, c: 3 })).toEqual({
        '1': 'a',
        '2': 'b',
        '3': 'c',
      });
    });

    it('should handle duplicate values (last wins)', () => {
      expect(invert({ a: 'x', b: 'x', c: 'y' })).toEqual({
        x: 'b',
        y: 'c',
      });
    });

    it('should convert non-string keys to strings', () => {
      expect(invert({ 1: 'a', 2: 'b' } as any)).toEqual({
        a: '1',
        b: '2',
      });
    });
  });

  describe('flip', () => {
    it('should flip function argument order', () => {
      const divide = (a: number, b: number) => a / b;
      const flippedDivide = flip(divide);
      expect(divide(10, 2)).toBe(5);
      expect(flippedDivide(10, 2)).toBe(0.2); // same as divide(2, 10)
    });

    it('should flip argument order', () => {
      const subtract = (a: number, b: number) => a - b;
      const flippedSubtract = flip(subtract);
      // subtract(10, 1) = 9, flippedSubtract(10, 1) = subtract(1, 10) = -9
      expect(flippedSubtract(10, 1)).toBe(-9);
    });
  });

  describe('compose', () => {
    it('should compose functions right-to-left', () => {
      const add = (x: number) => x + 1;
      const multiply = (x: number) => x * 2;
      const toString = (x: number) => x.toString();

      const process = compose(toString, multiply, add);
      expect(process(5)).toBe('12'); // (5 + 1) * 2 = 12, '12'
    });

    it('should compose string transformations', () => {
      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const exclaim = (s: string) => s + '!';

      const greet = compose(exclaim, capitalize);
      expect(greet('hello')).toBe('Hello!');
    });

    it('should handle single function', () => {
      const double = (x: number) => x * 2;
      const composed = compose(double);
      expect(composed(5)).toBe(10);
    });

    it('should handle empty composition', () => {
      const composed = compose();
      expect(composed(5)).toBe(5);
    });
  });

  describe('pipe', () => {
    it('should compose functions left-to-right', () => {
      const add = (x: number) => x + 1;
      const multiply = (x: number) => x * 2;
      const toString = (x: number) => x.toString();

      const pipeline = pipe(add, multiply, toString);
      expect(pipeline(5)).toBe('12'); // (5 + 1) * 2 = 12, '12'
    });

    it('should transform data', () => {
      const toNumber = (s: string) => parseInt(s, 10);
      const double = (x: number) => x * 2;
      const backToString = (x: number) => x.toString();

      const transform = pipe(toNumber, double, backToString);
      expect(transform('5')).toBe('10');
    });

    it('should handle single function', () => {
      const double = (x: number) => x * 2;
      const piped = pipe(double);
      expect(piped(5)).toBe(10);
    });

    it('should handle empty pipeline', () => {
      const piped = pipe();
      expect(piped(5)).toBe(5);
    });
  });
});
