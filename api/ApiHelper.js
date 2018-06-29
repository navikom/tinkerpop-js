import config from './apiSettings';
import MQTTApi from './MQTTApi';
import RESTApi from './RESTApi';
import WSApi from './WSApi';
import WebRTCApi from './WebRTCApi';

/**
 * ApiHelper
 */
export default class ApiHelper {

  static get(type) {
    switch (type) {
      case MQTTApi.TYPE:
        return MQTTApi.instance(config[type]);
      case WSApi.TYPE:
        return WSApi.instance(config[type]);
      case RESTApi.TYPE:
        return RESTApi.instance(config[type]);
      case WebRTCApi.TYPE:
        return WebRTCApi.instance(config[type]);
      default:
    }
  }
}

ApiHelper.REST = 'HTTP';
ApiHelper.WS = 'WS';
ApiHelper.MQTT = 'MQTT';
ApiHelper.WebRTC = 'WebRTC';
