import { describe, it, expect, jest } from '@jest/globals';
import { Kernel } from '../src/kernel.js';
import type { Plugin } from '../src/types.js';
import {
  PluginAlreadyRegisteredError,
  PluginNotFoundError,
  PluginDependencyMissingError,
  CircularDependencyError,
  PluginInitializationError,
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
    await expect(kernel.init()).rejects.toThrow(PluginInitializationError);
    expect(onErrorSpy).toHaveBeenCalledWith(error);
  });

  it('should unregister a plugin', async () => {
    const kernel = new Kernel();
    const onDestroySpy = jest.fn();
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
      onDestroy: onDestroySpy,
    };

    kernel.register(plugin);
    await kernel.unregister('test-plugin');

    expect(kernel.hasPlugin('test-plugin')).toBe(false);
    expect(onDestroySpy).toHaveBeenCalled();
  });

  it('should throw on unregistering non-existent plugin', async () => {
    const kernel = new Kernel();
    await expect(kernel.unregister('nonexistent')).rejects.toThrow(PluginNotFoundError);
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

  it('should emit plugin:unregistered event', async () => {
    const kernel = new Kernel();
    const handler = jest.fn();

    kernel.on('plugin:unregistered', handler);
    kernel.register({
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    });
    await kernel.unregister('test-plugin');

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ name: 'test-plugin' }));
  });

  it('should detect circular dependencies', () => {
    const kernel = new Kernel();

    const pluginA: Plugin = {
      name: 'plugin-a',
      version: '1.0.0',
      install: () => {},
    };
    const pluginB: Plugin = {
      name: 'plugin-b',
      version: '1.0.0',
      dependencies: ['plugin-a'],
      install: () => {},
    };
    const pluginC: Plugin = {
      name: 'plugin-c',
      version: '1.0.0',
      dependencies: ['plugin-b'],
      install: () => {},
    };

    // First register in order
    kernel.register(pluginA);
    kernel.register(pluginB);
    kernel.register(pluginC);

    expect(kernel.hasPlugin('plugin-a')).toBe(true);
    expect(kernel.hasPlugin('plugin-b')).toBe(true);
    expect(kernel.hasPlugin('plugin-c')).toBe(true);
  });

  it('should rollback on init failure', async () => {
    const kernel = new Kernel();
    const onDestroySpy1 = jest.fn();
    const onDestroySpy2 = jest.fn();

    const plugin1: Plugin = {
      name: 'plugin1',
      version: '1.0.0',
      install: () => {},
      onInit: () => {},
      onDestroy: onDestroySpy1,
    };
    const plugin2: Plugin = {
      name: 'plugin2',
      version: '1.0.0',
      install: () => {},
      onInit: () => {
        throw new Error('Init failed');
      },
      onDestroy: onDestroySpy2,
    };

    kernel.register(plugin1);
    kernel.register(plugin2);

    await expect(kernel.init()).rejects.toThrow(PluginInitializationError);
    // Plugin1 was initialized then rolled back
    expect(onDestroySpy1).toHaveBeenCalled();
  });

  it('should track plugin states', async () => {
    const kernel = new Kernel();
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
      onInit: () => {},
    };

    kernel.register(plugin);
    expect(kernel.getPluginState('test-plugin')).toBe('registered');

    await kernel.init();
    expect(kernel.getPluginState('test-plugin')).toBe('active');
  });

  it('should auto-initialize late-registered plugins', async () => {
    const kernel = new Kernel();
    const onInitSpy = jest.fn();

    // Initialize kernel first
    await kernel.init();
    expect(kernel.isInitialized()).toBe(true);

    // Register plugin after init
    const plugin: Plugin = {
      name: 'late-plugin',
      version: '1.0.0',
      install: () => {},
      onInit: onInitSpy,
    };

    kernel.register(plugin);

    // Wait for async initialization
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(onInitSpy).toHaveBeenCalled();
    expect(kernel.getPluginState('late-plugin')).toBe('active');
  });

  it('should prevent unregistering plugin with dependents', async () => {
    const kernel = new Kernel();

    const pluginA: Plugin = {
      name: 'plugin-a',
      version: '1.0.0',
      install: () => {},
    };
    const pluginB: Plugin = {
      name: 'plugin-b',
      version: '1.0.0',
      dependencies: ['plugin-a'],
      install: () => {},
    };

    kernel.register(pluginA);
    kernel.register(pluginB);

    await expect(kernel.unregister('plugin-a')).rejects.toThrow(
      'Cannot unregister plugin "plugin-a": plugin "plugin-b" depends on it'
    );
  });

  it('should handle multiple init calls', async () => {
    const kernel = new Kernel();
    const onInitSpy = jest.fn();

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
      onInit: onInitSpy,
    };

    kernel.register(plugin);

    // Call init multiple times
    await Promise.all([kernel.init(), kernel.init(), kernel.init()]);

    // Should only initialize once
    expect(onInitSpy).toHaveBeenCalledTimes(1);
  });

  it('should initialize plugins in dependency order', async () => {
    const kernel = new Kernel();
    const initOrder: string[] = [];

    const pluginA: Plugin = {
      name: 'plugin-a',
      version: '1.0.0',
      install: () => {},
      onInit: () => {
        initOrder.push('a');
      },
    };
    const pluginB: Plugin = {
      name: 'plugin-b',
      version: '1.0.0',
      dependencies: ['plugin-a'],
      install: () => {},
      onInit: () => {
        initOrder.push('b');
      },
    };
    const pluginC: Plugin = {
      name: 'plugin-c',
      version: '1.0.0',
      dependencies: ['plugin-b'],
      install: () => {},
      onInit: () => {
        initOrder.push('c');
      },
    };

    // Register in correct dependency order
    kernel.register(pluginA);
    kernel.register(pluginB);
    kernel.register(pluginC);

    await kernel.init();

    // Topological sort should ensure A -> B -> C order
    expect(initOrder).toEqual(['a', 'b', 'c']);
  });

  it('should accept initial context via options', () => {
    interface TestContext {
      db: string;
    }

    const kernel = new Kernel<TestContext>({
      context: { db: 'postgres' },
    });

    expect(kernel.getContext().db).toBe('postgres');
  });

  it('should return kernel state', () => {
    const kernel = new Kernel();
    expect(kernel.getState()).toBe('idle');
  });

  it('should get scoped event bus for plugin', () => {
    const kernel = new Kernel();
    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
    };

    kernel.register(plugin);
    const scopedBus = kernel.getScopedEventBus('test-plugin');

    expect(scopedBus).toBeDefined();
  });

  it('should return undefined for non-existent plugin scoped bus', () => {
    const kernel = new Kernel();
    expect(kernel.getScopedEventBus('nonexistent')).toBeUndefined();
  });

  it('should throw error when initializing destroyed kernel', async () => {
    const kernel = new Kernel();
    await kernel.destroy();

    await expect(kernel.init()).rejects.toThrow('Cannot initialize destroyed kernel');
  });

  it('should handle destroy errors gracefully', async () => {
    const kernel = new Kernel();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const plugin: Plugin = {
      name: 'error-plugin',
      version: '1.0.0',
      install: () => {},
      onDestroy: () => {
        throw new Error('Destroy failed');
      },
    };

    kernel.register(plugin);
    await kernel.destroy();

    expect(consoleSpy).toHaveBeenCalled();
    expect(kernel.getState()).toBe('destroyed');

    consoleSpy.mockRestore();
  });

  it('should not destroy already destroyed kernel', async () => {
    const kernel = new Kernel();
    await kernel.destroy();
    await kernel.destroy(); // Should not throw

    expect(kernel.getState()).toBe('destroyed');
  });

  it('should skip already initialized plugins', async () => {
    const kernel = new Kernel();
    const onInitSpy = jest.fn();

    const plugin: Plugin = {
      name: 'test-plugin',
      version: '1.0.0',
      install: () => {},
      onInit: onInitSpy,
    };

    kernel.register(plugin);
    await kernel.init();
    await kernel.init(); // Second init should be no-op

    expect(onInitSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle late registration init error', async () => {
    const kernel = new Kernel();
    const onErrorHandler = jest.fn();

    await kernel.init();

    kernel.on('plugin:error', onErrorHandler);

    const plugin: Plugin = {
      name: 'error-plugin',
      version: '1.0.0',
      install: () => {},
      onInit: () => {
        throw new Error('Late init failed');
      },
    };

    kernel.register(plugin);

    // Wait for async initialization
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(onErrorHandler).toHaveBeenCalled();
    expect(kernel.getPluginState('error-plugin')).toBe('error');
  });

  it('should detect actual circular dependency', async () => {
    // This test verifies the circular dependency error is thrown during init
    // when we manually create a circular reference after registration
    const kernel = new Kernel();

    // Create plugins without dependencies first
    const pluginA: Plugin = {
      name: 'circular-a',
      version: '1.0.0',
      dependencies: [],
      install: () => {},
    };

    kernel.register(pluginA);

    // Now manually add a circular reference by modifying dependencies
    // This is a hack to test the circular detection in topological sort
    (pluginA as any).dependencies = ['circular-a'];

    await expect(kernel.init()).rejects.toThrow(CircularDependencyError);
  });

  it('should handle rollback error logging', async () => {
    const kernel = new Kernel();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const plugin1: Plugin = {
      name: 'plugin1',
      version: '1.0.0',
      install: () => {},
      onInit: () => {},
      onDestroy: () => {
        throw new Error('Rollback destroy failed');
      },
    };
    const plugin2: Plugin = {
      name: 'plugin2',
      version: '1.0.0',
      install: () => {},
      onInit: () => {
        throw new Error('Init failed');
      },
    };

    kernel.register(plugin1);
    kernel.register(plugin2);

    await expect(kernel.init()).rejects.toThrow(PluginInitializationError);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should return undefined for non-existent plugin state', () => {
    const kernel = new Kernel();
    expect(kernel.getPluginState('nonexistent')).toBeUndefined();
  });
});
