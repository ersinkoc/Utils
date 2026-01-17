import { describe, it, expect } from '@jest/globals';
import {
  get,
  set,
  setMut,
  has,
  pick,
  omit,
  merge,
  keys,
  values,
  entries,
  fromEntries,
} from '../src/plugins/core/object.js';

describe('Object Utilities', () => {
  describe('get', () => {
    it('should get nested property', () => {
      const user = { name: 'Ersin', address: { city: 'Istanbul' } };
      expect(get(user, 'address.city')).toBe('Istanbul');
    });

    it('should return undefined for missing path', () => {
      const user = { name: 'Ersin', address: { city: 'Istanbul' } };
      expect(get(user, 'address.zip')).toBeUndefined();
    });

    it('should return default value for missing path', () => {
      const user = { name: 'Ersin', address: { city: 'Istanbul' } };
      expect(get(user, 'address.zip', '00000')).toBe('00000');
    });

    it('should handle array notation', () => {
      const data = { items: [{ id: 1 }, { id: 2 }] };
      expect(get(data, 'items[0].id')).toBe(1);
    });

    it('should handle null object', () => {
      expect(get(null, 'a.b')).toBeUndefined();
      expect(get(null, 'a.b', 'default')).toBe('default');
    });
  });

  describe('set', () => {
    it('should create new object with updated value', () => {
      const user = { name: 'Ersin', age: 30 };
      const updated = set(user, 'age', 31);
      expect(user.age).toBe(30); // unchanged
      expect(updated.age).toBe(31);
    });

    it('should update nested path', () => {
      const user = { profile: { name: 'Ersin' } };
      const updated = set(user, 'profile.name', 'Ali');
      expect(updated.profile.name).toBe('Ali');
    });

    it('should handle array notation at last level', () => {
      const data = { items: [{ id: 1 }, { id: 2 }] };
      // set supports array notation at the last level only: 'items[0]'
      const updated = set(data, 'items[0]', { id: 10 });
      expect(updated.items[0].id).toBe(10);
    });

    it('should return same reference for null', () => {
      const result = set(null, 'a', 1);
      expect(result).toBeNull();
    });

    it('should handle array notation when value is not an array', () => {
      const data = { items: 'not-an-array' };
      // When path has array notation but value is not array, falls back to regular set
      const updated = set(data, 'items[0]', 'value');
      // This sets a new key 'items[0]' (the bracket notation doesn't match array logic)
      expect(updated['items[0]']).toBe('value');
    });

    it('should handle creating nested objects when path does not exist', () => {
      const data = { existing: 'value' };
      const updated = set(data, 'new.nested.path', 'deep-value');
      expect(updated.new.nested.path).toBe('deep-value');
      expect(data.existing).toBe('value'); // original unchanged
    });
  });

  describe('setMut', () => {
    it('should mutate object', () => {
      const user = { name: 'Ersin', age: 30 };
      const result = setMut(user, 'age', 31);
      expect(user.age).toBe(31); // mutated
      expect(result).toBe(user); // same reference
    });
  });

  describe('has', () => {
    it('should return true for existing path', () => {
      const user = { name: 'Ersin', address: { city: 'Istanbul' } };
      expect(has(user, 'name')).toBe(true);
      expect(has(user, 'address.city')).toBe(true);
    });

    it('should return false for missing path', () => {
      const user = { name: 'Ersin', address: { city: 'Istanbul' } };
      expect(has(user, 'address.country')).toBe(false);
      expect(has(user, 'age')).toBe(false);
    });

    it('should handle null object', () => {
      expect(has(null, 'a.b')).toBe(false);
    });
  });

  describe('pick', () => {
    it('should create object with specified keys', () => {
      const user = { name: 'Ersin', age: 30, city: 'Istanbul' };
      const result = pick(user, ['name', 'age']);
      expect(result).toEqual({ name: 'Ersin', age: 30 });
    });

    it('should handle missing keys', () => {
      const user = { name: 'Ersin' };
      const result = pick(user, ['name', 'age'] as any);
      expect(result).toEqual({ name: 'Ersin' });
    });
  });

  describe('omit', () => {
    it('should create object without specified keys', () => {
      const user = { name: 'Ersin', age: 30, city: 'Istanbul' };
      const result = omit(user, ['age']);
      expect(result).toEqual({ name: 'Ersin', city: 'Istanbul' });
    });
  });

  describe('merge', () => {
    it('should merge objects', () => {
      expect(merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
    });

    it('should override with later sources', () => {
      expect(merge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
    });

    it('should handle multiple sources', () => {
      expect(merge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({
        a: 1,
        b: 2,
        c: 3,
      });
    });

    it('should filter __proto__ key', () => {
      const result = merge({}, { __proto__: { evil: true } } as any);
      expect(result).toEqual({});
    });

    it('should filter constructor key', () => {
      const result = merge({}, { constructor: { evil: true } } as any);
      expect(result).toEqual({});
    });

    it('should filter prototype key', () => {
      const result = merge({}, { prototype: { evil: true } } as any);
      expect(result).toEqual({});
    });
  });

  describe('keys', () => {
    it('should return typed keys', () => {
      const user = { name: 'Ersin', age: 30 };
      const result = keys(user);
      expect(result).toEqual(['name', 'age']);
    });
  });

  describe('values', () => {
    it('should return typed values', () => {
      const user = { name: 'Ersin', age: 30 };
      const result = values(user);
      expect(result).toEqual(['Ersin', 30]);
    });
  });

  describe('entries', () => {
    it('should return typed entries', () => {
      const user = { name: 'Ersin', age: 30 };
      const result = entries(user);
      expect(result).toEqual([
        ['name', 'Ersin'],
        ['age', 30],
      ]);
    });
  });

  describe('fromEntries', () => {
    it('should create object from entries', () => {
      const result = fromEntries([
        ['a', 1],
        ['b', 2],
      ]);
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });
});
