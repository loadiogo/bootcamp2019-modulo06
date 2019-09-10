import axios from 'axios';

const api = axios.create({
  baseURL: 'http://api.github.com',
  headers: {
    Authorization: 'token 287ca7e6d3f3cf43ffb208006d2b5dfa58fe046c',
  },
});

export default api;
