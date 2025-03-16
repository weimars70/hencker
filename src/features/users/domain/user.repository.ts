import type { User, UserCreate, UserUpdate } from './user.model';

export interface UserRepository {
  getUsers(filters?: Record<string, string>): Promise<User[]>;
  createUser(user: UserCreate): Promise<User>;
  updateUser(user: UserUpdate): Promise<User>;
  deleteUser(id: number): Promise<void>;
}