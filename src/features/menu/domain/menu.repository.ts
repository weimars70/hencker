import type { TreeNode } from './menu.model';
import type { Role } from './menu.model';

export interface MenuRepository {
  getMenuItems(): Promise<TreeNode[]>;
  getMenuRol(roleId: number): Promise<TreeNode[]>;
  getRoles(): Promise<Role[]>;
  saveMenuRol(roleId: number, menuTree: TreeNode[]): Promise<void>;
}