/*
import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
*/

import axios from 'axios';

const API = axios.create({
  // Uses environment variable in production, falls back to local host or /api during dev
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
