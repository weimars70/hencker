import { api } from 'src/boot/axios';
import type { TreeNode, Role } from '../domain/menu.model';
import type { MenuRepository } from '../domain/menu.repository';

export class MenuApi implements MenuRepository {
  async getMenuItems(): Promise<TreeNode[]> {
    try {
      const response = await api.get('/plantilla');
      return response.data[0]?.permisos;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw new Error('No se pudieron obtener los items del menú');
    }
  }

  async getMenuRol(roleId: number): Promise<TreeNode[]> {
    try {
      const response = await api.get(`/plantilla/${roleId}`);
      return response.data[0]?.permisos;
    } catch (error) {
      console.error('Error fetching role menu:', error);
      throw new Error('No se pudo obtener el menú del rol');
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw new Error('No se pudieron obtener los roles');
    }
  }

  async saveMenuRol(roleId: number, menuTree: TreeNode[]): Promise<void> {
    try {
      const dto = {
        permisos: menuTree, // Remove first and last quotes
        rol: roleId
      };
      await api.post('/plantilla', dto);
    } catch (error) {
      console.error('Error saving role menu:', error);
      throw new Error('No se pudo guardar el menú del rol');
    }
  }
}