import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from 'src/stores/auth';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({
  baseURL: 'http://108.181.193.178:3000/erp',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default boot(({ app, store }) => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore(store);
      const token = authStore.token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const authStore = useAuthStore(store);
      
      // Handle 401 Unauthorized responses
      if (error.response?.status === 401) {
        authStore.logout();
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };