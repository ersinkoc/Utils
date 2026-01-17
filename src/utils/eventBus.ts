/**
 * Simple event bus for inter-plugin communication.
 *
 * Allows plugins to emit and listen to events, enabling
 * communication between different parts of the system.
 */
export class EventBus {
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

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
}
