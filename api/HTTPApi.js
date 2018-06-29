import request from 'superagent';

export default class HTTPApi {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  static apiCall(method, url, body) {
    let req;
    switch (method) {
      case HTTPApi.GET: {
        req = request.get(url).query(body);
        break;
      }
      case HTTPApi.POST: {
        req = request.post(url).send(body);
        break;
      }
      case HTTPApi.PUT: {
        req = request.put(url).send(body);
        break;
      }
      case HTTPApi.DELETE: {
        req = request.del(url);
        break;
      }
      case HTTPApi.PATCH: {
        req = request('PATCH', url).send(body);
        break;
      }
      default:
    }

    return new Promise((resolve, reject) => {
      if (!req) {
        reject({ Errors: [`${method} not allowed in HTTPApiDataAgent`] });
      } else {
        req
          .end((err, res) => {
            if (err || !res.status) {
              reject(err);
            } else {
              resolve(res.body === null ? res.text : res.body);
            }
          });
      }
    });
  }
}

HTTPApi.GET = 'get';
HTTPApi.POST = 'post';
HTTPApi.PUT = 'put';
HTTPApi.DELETE = 'delete';
HTTPApi.PATCH = 'patch';
