import { api } from 'src/boot/axios';
import type { Size } from '../domain/size.model';
import type { SizeRepository } from '../domain/size.repository';

export class SizeApi implements SizeRepository {
  async getSizes(filters?: Record<string, string>): Promise<Size[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          params.append(key, value);
        });
      }
      
      const response = await api.get('/tallas', { params });
      console.log('reponse tallas', response);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching sizes:', error);
      throw new Error('No se pudieron obtener las tallas');
    }
  }

  async createSize(size: Omit<Size, 'id'>): Promise<Size> {
    try {
      const response = await api.post('/tallas', {
        codigo: size.codigo,
        nombre: size.nombre
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating size:', error);
      throw new Error('No se pudo crear la talla');
    }
  }

  async updateSize(size: Size): Promise<Size> {
    try {
      if (!size.codigo) {
        throw new Error('Código de talla requerido para actualizar');
      }
      const response = await api.put(`/tallas/${size.codigo}`, {
        nombre: size.nombre
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating size:', error);
      throw new Error('No se pudo actualizar la talla');
    }
  }

  async deleteSize(codigo: string): Promise<void> {
    try {
      await api.delete(`/tallas/${codigo}`);
    } catch (error) {
      console.error('Error deleting size:', error);
      throw new Error('No se pudo eliminar la talla');
    }
  }
}