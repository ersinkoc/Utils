import { describe, it, expect, jest } from '@jest/globals';
import { EventBus, ScopedEventBus } from '../src/utils/eventBus.js';

describe('EventBus', () => {
  it('should register and emit events', () => {
    const bus = new EventBus();
    const handler = jest.fn();

    bus.on('test', handler);
    bus.emit('test', 'data');

    expect(handler).toHaveBeenCalledWith('data');
  });

  it('should call multiple handlers for same event', () => {
    const bus = new EventBus();
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    bus.on('test', handler1);
    bus.on('test', handler2);
    bus.emit('test', 'data');

    expect(handler1).toHaveBeenCalledWith('data');
    expect(handler2).toHaveBeenCalledWith('data');
  });

  it('should unregister event listener', () => {
    const bus = new EventBus();
    const handler = jest.fn();

    bus.on('test', handler);
    bus.off('test', handler);
    bus.emit('test', 'data');

    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove event when last handler is removed', () => {
    const bus = new EventBus();
    const handler = jest.fn();

    bus.on('test', handler);
    expect(bus.listenerCount('test')).toBe(1);

    bus.off('test', handler);
    expect(bus.listenerCount('test')).toBe(0);
  });

  it('should handle errors in event handlers', () => {
    const bus = new EventBus();
    const errorHandler = jest.fn(() => {
      throw new Error('Handler error');
    });
    const normalHandler = jest.fn();

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    bus.on('test', errorHandler);
    bus.on('test', normalHandler);
    bus.emit('test', 'data');

    expect(errorHandler).toHaveBeenCalled();
    expect(normalHandler).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should remove all listeners for an event', () => {
    const bus = new EventBus();
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    bus.on('test', handler1);
    bus.on('test', handler2);
    bus.removeAllListeners('test');
    bus.emit('test', 'data');

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  it('should remove all listeners for all events', () => {
    const bus = new EventBus();
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    bus.on('event1', handler1);
    bus.on('event2', handler2);
    bus.removeAllListeners();
    bus.emit('event1', 'data');
    bus.emit('event2', 'data');

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  it('should return listener count', () => {
    const bus = new EventBus();
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    expect(bus.listenerCount('test')).toBe(0);

    bus.on('test', handler1);
    expect(bus.listenerCount('test')).toBe(1);

    bus.on('test', handler2);
    expect(bus.listenerCount('test')).toBe(2);

    bus.off('test', handler1);
    expect(bus.listenerCount('test')).toBe(1);
  });

  it('should handle multiple arguments', () => {
    const bus = new EventBus();
    const handler = jest.fn();

    bus.on('test', handler);
    bus.emit('test', 'arg1', 'arg2', 'arg3');

    expect(handler).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
  });

  it('should handle events with no listeners', () => {
    const bus = new EventBus();
    expect(() => bus.emit('nonexistent', 'data')).not.toThrow();
  });

  describe('Scoped Listeners', () => {
    it('should register scoped listeners', () => {
      const bus = new EventBus();
      const handler = jest.fn();

      bus.onScoped('plugin-a', 'test', handler);
      bus.emit('test', 'data');

      expect(handler).toHaveBeenCalledWith('data');
      expect(bus.hasScope('plugin-a')).toBe(true);
    });

    it('should remove all listeners for a scope', () => {
      const bus = new EventBus();
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const handler3 = jest.fn();

      bus.onScoped('plugin-a', 'event1', handler1);
      bus.onScoped('plugin-a', 'event2', handler2);
      bus.onScoped('plugin-b', 'event1', handler3);

      bus.removeScope('plugin-a');

      bus.emit('event1', 'data');
      bus.emit('event2', 'data');

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(handler3).toHaveBeenCalledWith('data');
      expect(bus.hasScope('plugin-a')).toBe(false);
      expect(bus.hasScope('plugin-b')).toBe(true);
    });

    it('should handle removing non-existent scope', () => {
      const bus = new EventBus();
      expect(() => bus.removeScope('nonexistent')).not.toThrow();
    });

    it('should return false for non-existent scope', () => {
      const bus = new EventBus();
      expect(bus.hasScope('nonexistent')).toBe(false);
    });
  });
});

describe('ScopedEventBus', () => {
  it('should register listeners through scoped bus', () => {
    const eventBus = new EventBus();
    const scopedBus = new ScopedEventBus(eventBus, 'my-plugin');
    const handler = jest.fn();

    scopedBus.on('test', handler);
    scopedBus.emit('test', 'data');

    expect(handler).toHaveBeenCalledWith('data');
  });

  it('should emit events through scoped bus', () => {
    const eventBus = new EventBus();
    const scopedBus = new ScopedEventBus(eventBus, 'my-plugin');
    const handler = jest.fn();

    eventBus.on('test', handler);
    scopedBus.emit('test', 'scoped-data');

    expect(handler).toHaveBeenCalledWith('scoped-data');
  });

  it('should unregister listener through scoped bus', () => {
    const eventBus = new EventBus();
    const scopedBus = new ScopedEventBus(eventBus, 'my-plugin');
    const handler = jest.fn();

    scopedBus.on('test', handler);
    scopedBus.off('test', handler);
    scopedBus.emit('test', 'data');

    expect(handler).not.toHaveBeenCalled();
  });

  it('should destroy all listeners on scope destroy', () => {
    const eventBus = new EventBus();
    const scopedBus = new ScopedEventBus(eventBus, 'my-plugin');
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    scopedBus.on('event1', handler1);
    scopedBus.on('event2', handler2);

    scopedBus.destroy();

    eventBus.emit('event1', 'data');
    eventBus.emit('event2', 'data');

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });
});
