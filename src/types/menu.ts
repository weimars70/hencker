export interface MenuNode {
    path: string
    label: string
    icon: string
    children?: MenuNode[]
  }
  export interface MenuItem {
    path: string
    label: string
    icon: string
    children: MenuItem[]
  }
  
  export interface MenuState {
    templateMenu: MenuItem[]
    permissionsMenu: MenuItem[]
    loading: boolean
    error: string | null
  }