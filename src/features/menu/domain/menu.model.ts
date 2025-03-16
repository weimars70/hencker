export interface TreeNode {
  path: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  tickable?: boolean;
  selectable?: boolean;
}

export interface Role {
  codigo: number;
  nombre: string;
}