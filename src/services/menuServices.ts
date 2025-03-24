import type { MenuNode } from '../types/menu'
import { api } from 'boot/axios';

export const menuService = {
  async getMenuItems(): Promise<MenuNode[]> {
    try {
      const response = await api.get('/plantilla');
    
      /*if (!response.data || !response.data.length) {
        return this.getDefaultMenu();
      }*/

      // Safely parse the permisos data
      let menuData;
      try {
        menuData = typeof response.data[0].permisos === 'string' 
          ? JSON.parse(response.data[0].permisos)
          : response.data[0].permisos;
          menuData = JSON.parse(menuData);
      } catch (parseError) {
        console.error('Error parsing menu data:', parseError);
        return [];
      }

      // Ensure we return a valid array
      //return Array.isArray(menuData) ? menuData : this.getDefaultMenu();
      return menuData;
      
    } catch (error) {
      console.error('Error loading menu:', error);
      return this.getDefaultMenu();
    }
  },

  getDefaultMenu(): MenuNode[] {
    return [
      { path: '/', label: 'Inicio', icon: 'home', children: [] },
      { path: '/colors', label: 'Colores', icon: 'palette', children: [] },
      { path: '/permisos', label: 'Opciones Menu', icon: 'admin_panel_settings', children: [] }
    ];
  },

  async getMenuRol(roleId: number): Promise<MenuNode[]> {
    try {
      if (!roleId || roleId <= 0) {
        return [];
      }

      const response = await api.get(`/plantilla/${roleId}`);
      if (!response.data || !response.data.length) {
        return [];
      }

      // Safely parse the permisos data
      try {
        const menuData = typeof response.data[0].permisos === 'string'
          ? JSON.parse(response.data[0].permisos)
          : response.data[0].permisos;

        return Array.isArray(menuData) ? menuData : [];
      } catch (parseError) {
        console.error('Error parsing role menu data:', parseError);
        return [];
      }
    } catch (error) {
      console.error('Error loading role menu:', error);
      return [];
    }
  },

  async getRoles(): Promise<any[]> {
    try {
      const response = await api.get('/roles');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error loading roles:', error);
      return [];
    }
  },

  async saveMenuRol(rol: number, permisos: MenuNode[]): Promise<void> {
    console.log(':::permisos:::', rol);
    if (!rol ) {
      throw new Error('Invalid role ID');
    }

    try {
      const payload = {
        permisos: JSON.stringify(permisos),
        rol
      };

      await api.post('/plantilla', payload);
    } catch (error) {
      console.error('Error saving menu:', error);
      throw new Error('Failed to save menu configuration');
    }
  }
};