import BaseComponent from './BaseComponent';

type Listener = (arg?: BaseComponent) => void;

class EventEmitter {
  private listeners: { [event: string]: Listener[] } = {};

  on(event: string, listener: Listener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event: string, listener: Listener): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
    }
  }

  emit(event: string, arg?: BaseComponent): void {
    console.log('arg=', arg);
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        listener(arg);
      });
    }
  }
}
const emitter = new EventEmitter();

export default emitter;
