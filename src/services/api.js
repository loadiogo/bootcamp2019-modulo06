import axios from 'axios';

const api = axios.create({
  baseURL: 'http://api.github.com',
  headers: {
    Authorization: process.env.OAUTH_TOKEN,
  },
});

export default api;
