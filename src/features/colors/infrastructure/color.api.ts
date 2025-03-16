import { api } from 'src/boot/axios';
import type { Color } from '../domain/color.model';
import type { ColorRepository } from '../domain/color.repository';

export class ColorApi implements ColorRepository {
  async getColors(filters?: Record<string, string>): Promise<Color[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          params.append(key, value);
        });
      }
      
      const response = await api.get('/colores', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching colors:', error);
      throw new Error('No se pudieron obtener los colores');
    }
  }

  async createColor(color: Omit<Color, 'id' | 'codigo'>): Promise<Color> {
    try {
      const response = await api.post('/colores', color);
      return response.data;
    } catch (error) {
      console.error('Error creating color:', error);
      throw new Error('No se pudo crear el color');
    }
  }

  async updateColor(color: Pick<Color, 'codigo' | 'nombre'>): Promise<Color> {
    try {
      if (!color.codigo) {
        throw new Error('Código de color requerido para actualizar');
      }
      const response = await api.put(`/colores/${color.codigo}`, {
        nombre: color.nombre
      });
      return response.data;
    } catch (error) {
      console.error('Error updating color:', error);
      throw new Error('No se pudo actualizar el color');
    }
  }

  async deleteColor(codigo: string): Promise<void> {
    try {
      await api.delete(`/colores/${codigo}`);
    } catch (error) {
      console.error('Error deleting color:', error);
      throw new Error('No se pudo eliminar el color');
    }
  }
}