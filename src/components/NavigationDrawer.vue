<template>
  <q-drawer 
    :model-value="modelValue"
    @update:model-value="$emit('update:model-value', $event)"
    show-if-above 
    bordered
    class="drawer-custom"
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <q-item-label header class="text-blue-7 text-weight-bold">
          {{ t('menu.title') }}
        </q-item-label>
        
        <q-item
          v-for="item in menuItems"
          :key="item.path"
          clickable
          v-ripple
          @click="$emit('menu-click', item)"
          :active="currentPath === item.path"
          class="q-my-sm drawer-item"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ t(`menu.${item.key}`) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

const menuItems = [
  { path: '/', key: 'home', icon: 'home', label: 'Inicio' },
  { path: '/colors', key: 'colors', icon: 'palette', label: 'Colores' },
  { path: '/sizes', key: 'sizes', icon: 'straighten', label: 'Tallas' },
  { path: '/item-groups', key: 'itemGroups', icon: 'category', label: 'Grupos de Artículos' },
  { path: '/purchases', key: 'purchases', icon: 'shopping_cart', label: 'Compras' }
];

const currentPath = computed(() => route.path);

defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  'update:model-value': [value: boolean];
  'menu-click': [item: typeof menuItems[0]];
}>();
</script>

<style lang="scss" scoped>
.drawer-custom {
  .q-drawer__content {
    background: #049115;
  }
  
  .q-item-label.header {
    padding: 16px;
    font-size: 14px;
  }
  
  .drawer-item {
    border-radius: 8px;
    margin: 4px 8px;
    min-height: 40px;
    padding: 8px 16px;
    font-size: 12px !important;
    color: rgba(0, 0, 0, 0.87);
    
    &:hover {
      background: rgba(30, 136, 229, 0.1);
      
      .q-icon {
        transform: scale(1.1);
      }
    }
    
    .q-icon {
      font-size: 20px;
      transition: transform 0.2s ease;
      color: var(--q-blue-7);
    }
    
    &.q-item--active {
      background: rgba(30, 136, 229, 0.15);
      color: var(--q-blue-7);
      font-weight: 500;
      
      &:hover {
        background: rgba(30, 136, 229, 0.2);
      }
      
      .q-icon {
        transform: scale(1.1);
      }
    }
  }
}

.body--dark {
  .drawer-custom {
    .q-drawer__content {
      background: #1d1d1d;
    }
    
    .drawer-item {
      color: rgba(255, 255, 255, 0.87);
      
      &:hover {
        background: rgba(30, 136, 229, 0.2);
      }
      
      &.q-item--active {
        background: rgba(30, 136, 229, 0.3);
      }
    }
  }
}
</style>