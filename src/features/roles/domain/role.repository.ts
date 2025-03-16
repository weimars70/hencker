import type { Role } from './role.model';

export interface RoleRepository {
  getRoles(filters?: Record<string, string>): Promise<Role[]>;
  createRole(role: Omit<Role, 'codigo'>): Promise<Role>;
  updateRole(role: Role): Promise<Role>;
  deleteRole(codigo: string): Promise<void>;
}