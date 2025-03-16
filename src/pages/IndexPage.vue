<template>
  <q-page class="dashboard-page q-pa-md">
    <div class="welcome-section text-center q-mb-md">
      <div class="text-h4 text-weight-bold q-mb-sm text-primary">
        Bienvenido al Sistema ERP
      </div>
      <div class="text-subtitle1 text-grey-7">Seleccione una opción para comenzar</div>
    </div>
    
    <div class="row q-col-gutter-sm justify-center items-stretch">
      <div v-for="item in menuItems" :key="item.path" class="col-12 col-sm-6 col-md-3">
        <q-card 
          class="menu-card cursor-pointer full-height"
          @click="openInTab(item)"
          v-ripple
        >
          <q-card-section class="text-center q-pa-sm">
            <div class="icon-container q-mb-sm">
              <q-icon :name="item.icon" size="32px" color="primary" />
            </div>
            <div class="text-subtitle1 text-primary q-mb-xs">{{ item.label }}</div>
            <div class="text-caption text-grey-7">{{ item.description }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  description: string;
}

const menuItems: MenuItem[] = [
  { 
    path: '/colors', 
    label: 'Colores', 
    icon: 'palette',
    description: 'Gestión de colores para productos'
  },
  { 
    path: '/sizes', 
    label: 'Tallas', 
    icon: 'straighten',
    description: 'Control de tallas y medidas'
  },
  { 
    path: '/item-groups', 
    label: 'Grupos', 
    icon: 'category',
    description: 'Clasificación de productos'
  },
  { 
    path: '/purchases', 
    label: 'Compras', 
    icon: 'shopping_cart',
    description: 'Gestión de compras e inventario'
  },
  { 
    path: '/roles', 
    label: 'Roles', 
    icon: 'admin_panel_settings',
    description: 'Administración de roles'
  },
  { 
    path: '/permisos', 
    label: 'Permisos', 
    icon: 'security',
    description: 'Gestión de permisos'
  },
  { 
    path: '/usuarios', 
    label: 'Usuarios', 
    icon: 'people',
    description: 'Administración de usuarios'
  }
];

// Get the tab management function from the parent
const openTabHandler = inject('openTab') as (node: { path: string; label: string; icon: string }) => void;

function openInTab(item: MenuItem) {
  if (openTabHandler) {
    openTabHandler({
      path: item.path,
      label: item.label,
      icon: item.icon
    });
  } else {
    router.push(item.path);
  }
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 0.5rem;
}

.welcome-section {
  padding: 0.5rem 0;
}

.menu-card {
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    .icon-container {
      transform: scale(1.05);
      
      .q-icon {
        color: var(--q-primary) !important;
      }
    }
  }
  
  .icon-container {
    transition: transform 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(var(--q-primary-rgb), 0.1);
    
    .q-icon {
      transition: color 0.2s ease;
    }
  }
}

.body--dark {
  .dashboard-page {
    background: var(--q-dark);
  }
  
  .menu-card {
    background: var(--q-dark);
    border-color: rgba(255, 255, 255, 0.1);
    
    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
    
    .icon-container {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>