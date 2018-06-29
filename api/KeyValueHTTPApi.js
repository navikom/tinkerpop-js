import HTTPApi from './HTTPApi';

export default class KeyValueHTTPApi extends HTTPApi {
  save(key, value, type) {
    return HTTPApi.apiCall('post', `${this.baseUrl}/Save`, { key, value, type });
  }

  get(key) {
    return HTTPApi.apiCall('get', `${this.baseUrl}/Get`, { key });
  }

  list(type) {
    return HTTPApi.apiCall('get', `${this.baseUrl}/List`, { type });
  }

  delete(key) {
    return HTTPApi.apiCall('post', `${this.baseUrl}/Delete`, { key });
  }
}
