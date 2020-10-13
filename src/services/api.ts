import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api'
});

api.interceptors.request.use(async config => {
    
    const token = localStorage.getItem('TokenAcesso');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export default api;