export interface User {
  id: number;
  usuario: string;
  nombre: string;
  email: string;
  clave?: string;
  rol: number;
  rol_nombre?: string;
}

export interface UserCreate {
  usuario: string;
  nombre: string;
  email: string;
  clave: string;
  rol: number;
}

export interface UserUpdate {
  id: number;
  nombre: string;
  email: string;
  rol: number;
}