import { Map } from './Map';
export class BaseConfiguration {

  constructor() {
    this._properties = new Map();
  }

  setProperty(key, value) {
    this._properties.put(key, value);
  }

  getProperty(key) {
    return this._properties.getValue(key);
  }

  containsKey(key) {
    return this._properties.contains(key);
  }

  getString(key, defaultValue) {
    if (!this._properties.containsKey(key)) {
      return defaultValue;
    }
    return this.getProperty(key);
  }
}
