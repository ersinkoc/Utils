import { Plugin } from './types.js';
import { EventBus } from './utils/eventBus.js';
import {
  PluginAlreadyRegisteredError,
  PluginNotFoundError,
  PluginDependencyMissingError
} from './errors.js';

/**
 * Micro-kernel for plugin system.
 *
 * Manages plugin registration, initialization, and lifecycle.
 * Provides event bus for inter-plugin communication.
 */
export class Kernel<TContext = unknown> {
  private plugins: Map<string, Plugin<TContext>> = new Map();
  private context: TContext = {} as TContext;
  private eventBus: EventBus = new EventBus();

  /**
   * Register a plugin with the kernel.
   *
   * @param plugin - Plugin to register
   * @throws {PluginAlreadyRegisteredError} If plugin name already exists
   * @throws {PluginDependencyMissingError} If plugin dependencies are not met
   */
  register(plugin: Plugin<TContext>): void {
    if (this.plugins.has(plugin.name)) {
      throw new PluginAlreadyRegisteredError(plugin.name);
    }

    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new PluginDependencyMissingError(plugin.name, dep);
        }
      }
    }

    this.plugins.set(plugin.name, plugin);

    try {
      plugin.install(this);
    } catch (error) {
      this.plugins.delete(plugin.name);
      throw error;
    }

    this.eventBus.emit('plugin:registered', { name: plugin.name, version: plugin.version });
  }

  /**
   * Initialize all registered plugins.
   *
   * Calls onInit() for each plugin that has it.
   * Plugins are initialized in the order they were registered.
   */
  async init(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.onInit) {
        try {
          await plugin.onInit(this.context);
        } catch (error) {
          if (plugin.onError) {
            plugin.onError(error as Error);
          }
          throw error;
        }
      }
    }

    this.eventBus.emit('kernel:initialized');
  }

  /**
   * Unregister a plugin.
   *
   * @param name - Plugin name to unregister
   * @throws {PluginNotFoundError} If plugin doesn't exist
   */
  unregister(name: string): void {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new PluginNotFoundError(name);
    }

    this.plugins.delete(name);

    if (plugin.onDestroy) {
      plugin.onDestroy();
    }

    this.eventBus.emit('plugin:unregistered', { name });
  }

  /**
   * Get the shared context object.
   *
   * @returns Shared context
   */
  getContext(): TContext {
    return this.context;
  }

  /**
   * Get a registered plugin by name.
   *
   * @param name - Plugin name
   * @returns Plugin instance or undefined
   */
  getPlugin(name: string): Plugin<TContext> | undefined {
    return this.plugins.get(name);
  }

  /**
   * Check if a plugin is registered.
   *
   * @param name - Plugin name
   * @returns True if plugin exists
   */
  hasPlugin(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Get list of all registered plugin names.
   *
   * @returns Array of plugin names
   */
  listPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Register an event listener.
   *
   * @param event - Event name
   * @param handler - Event handler function
   */
  on(event: string, handler: (...args: any[]) => void): void {
    this.eventBus.on(event, handler);
  }

  /**
   * Unregister an event listener.
   *
   * @param event - Event name
   * @param handler - Event handler function
   */
  off(event: string, handler: (...args: any[]) => void): void {
    this.eventBus.off(event, handler);
  }

  /**
   * Emit an event.
   *
   * @param event - Event name
   * @param args - Event data
   */
  emit(event: string, ...args: any[]): void {
    this.eventBus.emit(event, ...args);
  }

  /**
   * Destroy the kernel and all plugins.
   *
   * Unregisters all plugins and cleans up resources.
   */
  async destroy(): Promise<void> {
    const pluginNames = Array.from(this.plugins.keys());
    for (const name of pluginNames) {
      this.unregister(name);
    }
    this.eventBus.removeAllListeners();
  }
}

export type { Plugin } from './types.js';

