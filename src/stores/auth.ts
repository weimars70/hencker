import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  sucursal: number | null ;
  token: string | null;
  rol: number | null;
  branch: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  rol: number;
  sucursal: number;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    sucursal: null,
    rol: null,
    branch: 'main'
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(credentials: { username: string; password: string, sucursal: number, rol: number }) {
      const data = {
        username: credentials.username,
        password: btoa(credentials.password)
      };
      
      try {
        const response = await api.post<LoginResponse>('/usuarios/login', data);
        const resp = response.data;
  
        if (!resp.success) throw new Error(resp.message);
       
        const jsonData = JSON.parse(JSON.stringify(response.data.message));
        
        console.log('response login response:', jsonData);
        // Store token and user data
        this.token = jsonData.token;
        this.user = jsonData.user;
        this.sucursal = jsonData.sucursal;
        this.rol = jsonData.rol;
        

        // Set token in axios default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

        return true;
      } catch (error: any) {
        console.error('Login error:', error);
        throw new Error(error.response?.data?.message || 'Credenciales inválidas');
      }
    },

    setBranch(branch: string) {
      this.branch = branch;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.sucursal = null;
      this.rol = null;
      this.branch = 'main';
      
      // Remove token from axios headers
      delete api.defaults.headers.common['Authorization'];
    }
  },

  persist: {
    key: 'auth-store',
    paths: ['user', 'token', 'branch', 'sucursal', 'rol']
  }
});