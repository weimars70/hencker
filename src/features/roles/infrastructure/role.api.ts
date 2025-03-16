import { api } from 'src/boot/axios';
import type { Role } from '../domain/role.model';
import type { RoleRepository } from '../domain/role.repository';

export class RoleApi implements RoleRepository {
  async getRoles(filters?: Record<string, string>): Promise<Role[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          params.append(key, value);
        });
      }
      
      const response = await api.get('/roles', { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw new Error('No se pudieron obtener los roles');
    }
  }

  async createRole(role: Omit<Role, 'codigo'>): Promise<Role> {
    try {
      const response = await api.post('/roles', {
        nombre: role.nombre
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw new Error('No se pudo crear el rol');
    }
  }

  async updateRole(role: Role): Promise<Role> {
    try {
      if (!role.codigo) {
        throw new Error('Código de rol requerido para actualizar');
      }
      const response = await api.put(`/roles/${role.codigo}`, {
        nombre: role.nombre
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw new Error('No se pudo actualizar el rol');
    }
  }

  async deleteRole(codigo: string): Promise<void> {
    try {
      await api.delete(`/roles/${codigo}`);
    } catch (error) {
      console.error('Error deleting role:', error);
      throw new Error('No se pudo eliminar el rol');
    }
  }
}