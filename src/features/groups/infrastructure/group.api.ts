import { api } from 'src/boot/axios';
import type { Group } from '../domain/group.model';
import type { GroupRepository } from '../domain/group.repository';

export class GroupApi implements GroupRepository {
  async getGroups(filters?: Record<string, string>): Promise<Group[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          params.append(key, value);
        });
      }
      
      const response = await api.get('/items-grupos', { params });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw new Error('No se pudieron obtener los grupos');
    }
  }

  async createGroup(group: Omit<Group, 'codigo'>): Promise<Group> {
    try {
      const response = await api.post('/items-grupos', {
        nombre: group.nombre
      });
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw new Error('No se pudo crear el grupo');
    }
  }

  async updateGroup(group: Group): Promise<Group> {
    try {
      if (!group.codigo) {
        throw new Error('Código de grupo requerido para actualizar');
      }
      const response = await api.put(`/items-grupos/${group.codigo}`, {
        nombre: group.nombre
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating group:', error);
      throw new Error('No se pudo actualizar el grupo');
    }
  }

  async deleteGroup(codigo: string): Promise<void> {
    try {
      await api.delete(`/items-grupos/${codigo}`);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error('No se pudo eliminar el grupo');
    }
  }
}