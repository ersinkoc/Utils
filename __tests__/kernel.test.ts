import { describe, it, expect, jest } from '@jest/globals';
import { Kernel } from '../src/kernel.js';
import type { Plugin } from '../src/types.js';
import {
  PluginAlreadyRegisteredError,
  PluginNotFoundError,
  PluginDependencyMissingError,
} from '../src/errors.js';

describe('Kernel', () => {
  it('should register a plugin', () => {
    const kernel = new Kernel();
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    };

    kernel.register(plugin);
    expect(kernel.hasPlugin('test-plugin')).toBe(true);
  });

  it('should throw on duplicate plugin registration', () => {
    const kernel = new Kernel();
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    };

    kernel.register(plugin);
    expect(() => kernel.register(plugin)).toThrow(PluginAlreadyRegisteredError);
  });

  it('should throw on missing dependency', () => {
    const kernel = new Kernel();
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      dependencies: ['missing-plugin'],
      install: () => {},
    };

    expect(() => kernel.register(plugin)).toThrow(PluginDependencyMissingError);
  });

  it('should register plugins with dependencies', () => {
    const kernel = new Kernel();
    const plugin1: Plugin = {
      name: 'plugin1',
      version: '1.0.0',
      install: () => {},
    };
    const plugin2: Plugin = {
      name: 'plugin2',
      version: '1.0.0',
      dependencies: ['plugin1'],
      install: () => {},
    };

    kernel.register(plugin1);
    kernel.register(plugin2);
    expect(kernel.hasPlugin('plugin2')).toBe(true);
  });

  it('should call install on registration', () => {
    const kernel = new Kernel();
    const installSpy = jest.fn();
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: installSpy,
    };

    kernel.register(plugin);
    expect(installSpy).toHaveBeenCalledWith(kernel);
  });

  it('should rollback on install error', () => {
    const kernel = new Kernel();
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {
        throw new Error('Install failed');
      },
    };

    expect(() => kernel.register(plugin)).toThrow('Install failed');
    expect(kernel.hasPlugin('test-plugin')).toBe(false);
  });

  it('should initialize all plugins', async () => {
    const kernel = new Kernel();
    const onInitSpy1 = jest.fn();
    const onInitSpy2 = jest.fn();

    const plugin1: Plugin = {
      name: 'plugin1',
      version: '1.0.0',
      install: () => {},
      onInit: onInitSpy1,
    };
    const plugin2: Plugin = {
      name: 'plugin2',
      version: '1.0.0',
      install: () => {},
      onInit: onInitSpy2,
    };

    kernel.register(plugin1);
    kernel.register(plugin2);
    await kernel.init();

    expect(onInitSpy1).toHaveBeenCalled();
    expect(onInitSpy2).toHaveBeenCalled();
  });

  it('should call onError on init error', async () => {
    const kernel = new Kernel();
    const onErrorSpy = jest.fn();
    const error = new Error('Init failed');

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
      onInit: () => {
        throw error;
      },
      onError: onErrorSpy,
    };

    kernel.register(plugin);
    await expect(kernel.init()).rejects.toThrow(error);
    expect(onErrorSpy).toHaveBeenCalledWith(error);
  });

  it('should unregister a plugin', () => {
    const kernel = new Kernel();
    const onDestroySpy = jest.fn();
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
      onDestroy: onDestroySpy,
    };

    kernel.register(plugin);
    kernel.unregister('test-plugin');

    expect(kernel.hasPlugin('test-plugin')).toBe(false);
    expect(onDestroySpy).toHaveBeenCalled();
  });

  it('should throw on unregistering non-existent plugin', () => {
    const kernel = new Kernel();
    expect(() => kernel.unregister('nonexistent')).toThrow(PluginNotFoundError);
  });

  it('should get plugin by name', () => {
    const kernel = new Kernel();
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    };

    kernel.register(plugin);
    expect(kernel.getPlugin('test-plugin')).toBe(plugin);
  });

  it('should return undefined for non-existent plugin', () => {
    const kernel = new Kernel();
    expect(kernel.getPlugin('nonexistent')).toBeUndefined();
  });

  it('should list all plugin names', () => {
    const kernel = new Kernel();
    const plugin1: Plugin = {
      name: 'plugin1',
      version: '1.0.0',
      install: () => {},
    };
    const plugin2: Plugin = {
      name: 'plugin2',
      version: '1.0.0',
      install: () => {},
    };

    kernel.register(plugin1);
    kernel.register(plugin2);

    expect(kernel.listPlugins()).toEqual(['plugin1', 'plugin2']);
  });

  it('should manage event listeners', () => {
    const kernel = new Kernel();
    const handler = jest.fn();

    kernel.on('test-event', handler);
    kernel.emit('test-event', 'data');

    expect(handler).toHaveBeenCalledWith('data');

    kernel.off('test-event', handler);
    kernel.emit('test-event', 'data');

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should share context between plugins', async () => {
    interface TestContext {
      value?: string;
    }
    const kernel = new Kernel<TestContext>();

    const plugin1: Plugin<TestContext> = {
      name: 'plugin1',
      version: '1.0.0',
      install: () => {},
      onInit: (ctx) => {
        ctx.value = 'shared';
      },
    };
    const plugin2: Plugin<TestContext> = {
      name: 'plugin2',
      version: '1.0.0',
      install: () => {},
      onInit: (ctx) => {
        expect(ctx.value).toBe('shared');
      },
    };

    kernel.register(plugin1);
    kernel.register(plugin2);
    await kernel.init();

    expect(kernel.getContext().value).toBe('shared');
  });

  it('should destroy all plugins', async () => {
    const kernel = new Kernel();
    const onDestroySpy1 = jest.fn();
    const onDestroySpy2 = jest.fn();

    const plugin1: Plugin = {
      name: 'plugin1',
      version: '1.0.0',
      install: () => {},
      onDestroy: onDestroySpy1,
    };
    const plugin2: Plugin = {
      name: 'plugin2',
      version: '1.0.0',
      install: () => {},
      onDestroy: onDestroySpy2,
    };

    kernel.register(plugin1);
    kernel.register(plugin2);
    await kernel.destroy();

    expect(kernel.listPlugins()).toEqual([]);
    expect(onDestroySpy1).toHaveBeenCalled();
    expect(onDestroySpy2).toHaveBeenCalled();
  });

  it('should emit plugin:registered event', () => {
    const kernel = new Kernel();
    const handler = jest.fn();

    kernel.on('plugin:registered', handler);
    kernel.register({
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    });

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test-plugin',
        version: '1.0.0',
      })
    );
  });

  it('should emit kernel:initialized event', async () => {
    const kernel = new Kernel();
    const handler = jest.fn();

    kernel.on('kernel:initialized', handler);
    kernel.register({
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    });
    await kernel.init();

    expect(handler).toHaveBeenCalled();
  });

  it('should emit plugin:unregistered event', () => {
    const kernel = new Kernel();
    const handler = jest.fn();

    kernel.on('plugin:unregistered', handler);
    kernel.register({
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    });
    kernel.unregister('test-plugin');

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ name: 'test-plugin' }));
  });
});
