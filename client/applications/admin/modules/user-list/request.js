import fetch from 'libs/fetch';

export default {
  getUserList() {
    return fetch.get('/api/admin/users');
  },
  createUser(body) {
    return fetch.post('/api/admin/user/create', {
      body
    });
  }
};
