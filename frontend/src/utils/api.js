import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Lazy import to break the circular dependency:
      // store.js → authSlice.js → api.js → store.js
      import('../store/store.js').then(({ store }) => {
        import('../store/slices/authSlice.js').then(({ clearAuth }) => {
          store.dispatch(clearAuth());
        });
      });
    }
    return Promise.reject(error);
  }
);

export default api;
