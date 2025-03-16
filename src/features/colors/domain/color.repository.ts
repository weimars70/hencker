import type { Color } from './color.model';

export interface ColorRepository {
  getColors(filters?: Record<string, string>): Promise<Color[]>;
  createColor(color: Omit<Color, 'id' | 'codigo'>): Promise<Color>;
  updateColor(color: Color): Promise<Color>;
  deleteColor(codigo: string): Promise<void>;
}