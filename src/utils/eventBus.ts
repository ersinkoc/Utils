type EventHandler = (...args: any[]) => void;

/**
 * Simple event bus for inter-plugin communication.
 *
 * Allows plugins to emit and listen to events, enabling
 * communication between different parts of the system.
 */
export class EventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private scopedHandlers: Map<string, Map<string, Set<EventHandler>>> = new Map();

  /**
   * Register an event listener.
   *
   * @param event - Event name to listen for
   * @param handler - Function to call when event is emitted
   */
  on(event: string, handler: (...args: any[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  /**
   * Unregister an event listener.
   *
   * @param event - Event name
   * @param handler - Function to remove
   */
  off(event: string, handler: (...args: any[]) => void): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit an event to all registered listeners.
   *
   * @param event - Event name to emit
   * @param args - Arguments to pass to handlers
   */
  emit(event: string, ...args: any[]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      }
    }
  }

  /**
   * Remove all listeners for an event or all events.
   *
   * @param event - Event name to clear (if not provided, clears all)
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get the number of listeners for an event.
   *
   * @param event - Event name
   * @returns Number of listeners
   */
  listenerCount(event: string): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  /**
   * Register an event listener with a scope (e.g., plugin name).
   * Scoped listeners can be removed all at once using removeScope().
   *
   * @param scope - Scope identifier (e.g., plugin name)
   * @param event - Event name to listen for
   * @param handler - Function to call when event is emitted
   */
  onScoped(scope: string, event: string, handler: EventHandler): void {
    // Add to main listeners
    this.on(event, handler);

    // Track in scoped handlers
    if (!this.scopedHandlers.has(scope)) {
      this.scopedHandlers.set(scope, new Map());
    }
    const scopeMap = this.scopedHandlers.get(scope)!;
    if (!scopeMap.has(event)) {
      scopeMap.set(event, new Set());
    }
    scopeMap.get(event)!.add(handler);
  }

  /**
   * Remove all listeners registered under a specific scope.
   * Useful for cleanup when a plugin is unregistered.
   *
   * @param scope - Scope identifier to remove
   */
  removeScope(scope: string): void {
    const scopeMap = this.scopedHandlers.get(scope);
    if (!scopeMap) return;

    for (const [event, handlers] of scopeMap) {
      for (const handler of handlers) {
        this.off(event, handler);
      }
    }
    this.scopedHandlers.delete(scope);
  }

  /**
   * Check if a scope has any registered listeners.
   *
   * @param scope - Scope identifier
   * @returns True if scope has listeners
   */
  hasScope(scope: string): boolean {
    return this.scopedHandlers.has(scope);
  }
}

/**
 * Scoped event bus wrapper for plugins.
 * Automatically tracks all listeners under a scope for easy cleanup.
 */
export class ScopedEventBus {
  constructor(
    private readonly eventBus: EventBus,
    private readonly scope: string
  ) {}

  /**
   * Register an event listener (automatically scoped).
   */
  on(event: string, handler: EventHandler): void {
    this.eventBus.onScoped(this.scope, event, handler);
  }

  /**
   * Unregister an event listener.
   */
  off(event: string, handler: EventHandler): void {
    this.eventBus.off(event, handler);
  }

  /**
   * Emit an event.
   */
  emit(event: string, ...args: any[]): void {
    this.eventBus.emit(event, ...args);
  }

  /**
   * Remove all listeners registered by this scoped bus.
   */
  destroy(): void {
    this.eventBus.removeScope(this.scope);
  }
}
