import type { Group } from './group.model';

export interface GroupRepository {
  getGroups(filters?: Record<string, string>): Promise<Group[]>;
  createGroup(group: Omit<Group, 'codigo'>): Promise<Group>;
  updateGroup(group: Group): Promise<Group>;
  deleteGroup(codigo: string): Promise<void>;
}