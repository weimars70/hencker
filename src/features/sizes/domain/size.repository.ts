import type { Size } from './size.model';

export interface SizeRepository {
  getSizes(filters?: Record<string, string>): Promise<Size[]>;
  createSize(size: Size): Promise<Size>;
  updateSize(size: Size): Promise<Size>;
  deleteSize(codigo: string): Promise<void>;
}