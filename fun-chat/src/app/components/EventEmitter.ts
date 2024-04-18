import { Listener } from '../utils/types';

class EventEmitter {
  private listeners: { [event: string]: Listener[] } = {};

  public on(event: string, listener: Listener): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);

    return (): void => {
      this.off(event, listener);
    };
  }

  public off(event: string, listener: Listener): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
    }
  }

  public emit(event: string, ...args: unknown[]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        listener(...args);
      });
    }
  }
}
const emitter = new EventEmitter();

export default emitter;
