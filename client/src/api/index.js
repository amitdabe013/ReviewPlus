import axios from 'axios';

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/signup');
    if (err.response?.status === 401 && !isAuthRoute) {
      const hadToken = !!localStorage.getItem('rb_token');
      localStorage.removeItem('rb_token');
      // Only force-redirect if session expired; skip if user deliberately logged out (token already gone)
      if (hadToken) window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
