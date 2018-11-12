import fetch from 'libs/fetch';

export default {
  getBlogList() {
    return fetch.get('/api/blog/list');
  },
  logout() {
    return fetch.get('/api/logout');
  }
}
