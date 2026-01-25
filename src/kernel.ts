import { Plugin } from './types.js';
import { EventBus, ScopedEventBus } from './utils/eventBus.js';
import {
  PluginAlreadyRegisteredError,
  PluginNotFoundError,
  PluginDependencyMissingError,
  CircularDependencyError,
  PluginInitializationError
} from './errors.js';

/**
 * Plugin lifecycle states.
 */
export type PluginState = 'registered' | 'initializing' | 'active' | 'error' | 'destroyed';

/**
 * Internal plugin metadata.
 */
interface PluginEntry<TContext> {
  plugin: Plugin<TContext>;
  state: PluginState;
  scopedBus: ScopedEventBus;
}

/**
 * Kernel initialization state.
 */
type KernelState = 'idle' | 'initializing' | 'initialized' | 'destroyed';

/**
 * Options for kernel initialization.
 */
export interface KernelOptions<TContext> {
  /**
   * Initial context value. If not provided, an empty object is used.
   */
  context?: TContext;
}

/**
 * Micro-kernel for plugin system.
 *
 * Manages plugin registration, initialization, and lifecycle.
 * Provides event bus for inter-plugin communication.
 *
 * Features:
 * - Plugin state tracking (registered, initializing, active, error, destroyed)
 * - Automatic scoped event listeners (cleaned up on unregister)
 * - Topological sorting for dependency resolution
 * - Circular dependency detection
 * - Partial initialization rollback
 * - Race condition prevention
 * - Late plugin registration support
 */
export class Kernel<TContext = unknown> {
  private plugins: Map<string, PluginEntry<TContext>> = new Map();
  private context: TContext;
  private eventBus: EventBus = new EventBus();
  private state: KernelState = 'idle';
  private initPromise: Promise<void> | null = null;

  constructor(options?: KernelOptions<TContext>) {
    this.context = options?.context ?? ({} as TContext);
  }

  /**
   * Register a plugin with the kernel.
   *
   * If the kernel is already initialized, the plugin will be
   * automatically initialized after registration.
   *
   * @param plugin - Plugin to register
   * @throws {PluginAlreadyRegisteredError} If plugin name already exists
   * @throws {PluginDependencyMissingError} If plugin dependencies are not met
   */
  register(plugin: Plugin<TContext>): void {
    if (this.plugins.has(plugin.name)) {
      throw new PluginAlreadyRegisteredError(plugin.name);
    }

    // Validate dependencies exist
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new PluginDependencyMissingError(plugin.name, dep);
        }
      }
    }

    // Create scoped event bus for this plugin
    const scopedBus = new ScopedEventBus(this.eventBus, plugin.name);

    const entry: PluginEntry<TContext> = {
      plugin,
      state: 'registered',
      scopedBus
    };

    this.plugins.set(plugin.name, entry);

    try {
      plugin.install(this);
    } catch (error) {
      this.plugins.delete(plugin.name);
      scopedBus.destroy();
      throw error;
    }

    this.eventBus.emit('plugin:registered', { name: plugin.name, version: plugin.version });

    // Auto-initialize if kernel is already initialized
    if (this.state === 'initialized') {
      this.initPlugin(entry).catch((error) => {
        entry.state = 'error';
        this.eventBus.emit('plugin:error', { name: plugin.name, error });
      });
    }
  }

  /**
   * Initialize all registered plugins.
   *
   * Plugins are initialized in topological order based on dependencies.
   * If initialization fails, already initialized plugins are rolled back.
   *
   * @throws {CircularDependencyError} If circular dependency detected
   * @throws {PluginInitializationError} If a plugin fails to initialize
   */
  async init(): Promise<void> {
    if (this.state === 'initialized') {
      return;
    }

    if (this.state === 'initializing') {
      // Wait for existing initialization
      return this.initPromise!;
    }

    if (this.state === 'destroyed') {
      throw new Error('Cannot initialize destroyed kernel');
    }

    this.state = 'initializing';

    this.initPromise = this.doInit();
    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  private async doInit(): Promise<void> {
    // Get plugins in dependency order
    const sortedEntries = this.topologicalSort();
    const initializedStack: PluginEntry<TContext>[] = [];

    for (const entry of sortedEntries) {
      try {
        await this.initPlugin(entry);
        initializedStack.push(entry);
      } catch (error) {
        entry.state = 'error';

        // Rollback: destroy already initialized plugins in reverse order
        for (const initialized of initializedStack.reverse()) {
          try {
            await this.destroyPlugin(initialized);
          } catch (destroyError) {
            console.error(
              `Error during rollback of plugin "${initialized.plugin.name}":`,
              destroyError
            );
          }
        }

        this.state = 'idle';
        throw new PluginInitializationError(
          entry.plugin.name,
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }

    this.state = 'initialized';
    this.eventBus.emit('kernel:initialized');
  }

  /**
   * Initialize a single plugin.
   */
  private async initPlugin(entry: PluginEntry<TContext>): Promise<void> {
    if (entry.state !== 'registered') {
      return;
    }

    entry.state = 'initializing';
    this.eventBus.emit('plugin:initializing', { name: entry.plugin.name });

    if (entry.plugin.onInit) {
      try {
        await entry.plugin.onInit(this.context);
      } catch (error) {
        if (entry.plugin.onError) {
          entry.plugin.onError(error as Error);
        }
        throw error;
      }
    }

    entry.state = 'active';
    this.eventBus.emit('plugin:initialized', { name: entry.plugin.name });
  }

  /**
   * Destroy a single plugin.
   */
  private async destroyPlugin(entry: PluginEntry<TContext>): Promise<void> {
    if (entry.state === 'destroyed') {
      return;
    }

    // Clean up scoped event listeners
    entry.scopedBus.destroy();

    if (entry.plugin.onDestroy) {
      await entry.plugin.onDestroy();
    }

    entry.state = 'destroyed';
  }

  /**
   * Topological sort of plugins based on dependencies.
   * Detects circular dependencies.
   *
   * @returns Plugins sorted in dependency order
   * @throws {CircularDependencyError} If circular dependency detected
   */
  private topologicalSort(): PluginEntry<TContext>[] {
    const result: PluginEntry<TContext>[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (name: string, path: string[]): void => {
      if (visited.has(name)) return;

      if (visiting.has(name)) {
        const cycleStart = path.indexOf(name);
        const cycle = [...path.slice(cycleStart), name];
        throw new CircularDependencyError(cycle);
      }

      const entry = this.plugins.get(name);
      if (!entry) return;

      visiting.add(name);
      const currentPath = [...path, name];

      if (entry.plugin.dependencies) {
        for (const dep of entry.plugin.dependencies) {
          visit(dep, currentPath);
        }
      }

      visiting.delete(name);
      visited.add(name);
      result.push(entry);
    };

    for (const name of this.plugins.keys()) {
      visit(name, []);
    }

    return result;
  }

  /**
   * Unregister a plugin.
   *
   * Automatically cleans up event listeners registered by this plugin.
   *
   * @param name - Plugin name to unregister
   * @throws {PluginNotFoundError} If plugin doesn't exist
   */
  async unregister(name: string): Promise<void> {
    const entry = this.plugins.get(name);
    if (!entry) {
      throw new PluginNotFoundError(name);
    }

    // Check if other plugins depend on this one
    for (const [otherName, otherEntry] of this.plugins) {
      if (otherName !== name && otherEntry.plugin.dependencies?.includes(name)) {
        throw new Error(
          `Cannot unregister plugin "${name}": plugin "${otherName}" depends on it`
        );
      }
    }

    await this.destroyPlugin(entry);
    this.plugins.delete(name);

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
    return this.plugins.get(name)?.plugin;
  }

  /**
   * Get the state of a registered plugin.
   *
   * @param name - Plugin name
   * @returns Plugin state or undefined if not found
   */
  getPluginState(name: string): PluginState | undefined {
    return this.plugins.get(name)?.state;
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
   * Get the kernel's current state.
   *
   * @returns Current kernel state
   */
  getState(): KernelState {
    return this.state;
  }

  /**
   * Check if kernel is initialized.
   *
   * @returns True if kernel is initialized
   */
  isInitialized(): boolean {
    return this.state === 'initialized';
  }

  /**
   * Get the scoped event bus for a plugin.
   * Listeners registered through this bus are automatically
   * cleaned up when the plugin is unregistered.
   *
   * @param pluginName - Plugin name
   * @returns Scoped event bus or undefined
   */
  getScopedEventBus(pluginName: string): ScopedEventBus | undefined {
    return this.plugins.get(pluginName)?.scopedBus;
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
   * Unregisters all plugins in reverse dependency order and cleans up resources.
   */
  async destroy(): Promise<void> {
    if (this.state === 'destroyed') {
      return;
    }

    // Get plugins in reverse dependency order for safe destruction
    const sortedEntries = this.topologicalSort().reverse();

    for (const entry of sortedEntries) {
      try {
        await this.destroyPlugin(entry);
      } catch (error) {
        console.error(`Error destroying plugin "${entry.plugin.name}":`, error);
      }
    }

    this.plugins.clear();
    this.eventBus.removeAllListeners();
    this.state = 'destroyed';

    this.eventBus.emit('kernel:destroyed');
  }
}

export type { Plugin } from './types.js';
