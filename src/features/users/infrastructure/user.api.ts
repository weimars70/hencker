import { api } from 'src/boot/axios';
import type { User, UserCreate, UserUpdate } from '../domain/user.model';
import type { UserRepository } from '../domain/user.repository';

export class UserApi implements UserRepository {
  async getUsers(filters?: Record<string, string>): Promise<User[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          params.append(key, value);
        });
      }
      
      const response = await api.get('/usuarios', { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('No se pudieron obtener los usuarios');
    }
  }

  async createUser(userData: UserCreate): Promise<User> {
    try {
      const response = await api.post('/usuarios', {
        usuario: userData.usuario,
        nombre: userData.nombre,
        email: userData.email,
        clave:  btoa(userData.clave),
        rol: userData.rol
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('No se pudo crear el usuario');
    }
  }

  async updateUser(userData: UserUpdate): Promise<User> {
    try {
      if (!userData.id) {
        throw new Error('ID de usuario requerido para actualizar');
      }
      const response = await api.put(`/usuarios/${userData.id}`, {
        nombre: userData.nombre,
        email: userData.email,
        rol: userData.rol
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('No se pudo actualizar el usuario');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(`/usuarios/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('No se pudo eliminar el usuario');
    }
  }
}