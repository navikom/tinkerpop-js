import { List } from '../../../../../util';

/**
 * ListCallbackRegistry
 */
export default class ListCallbackRegistry {
  addCallback(c) {
    if (!this.callbacks) this.callbacks = new List();
    this.callbacks.add(c);
  }

  removeCallback(c) {
    if (this.callbacks) this.callbacks.removeByValue(c);
  }

  clearCallbacks() {
    if (this.callbacks) this.callbacks.clear();
  }

  getCallbacks() {
    return (this.callbacks) ? this.callbacks : new List();
  }
}
