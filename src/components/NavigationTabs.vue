<template>
  <div class="navigation-tabs" :class="{ 'drawer-open': drawerOpen }">
    <div class="tabs-wrapper">
      <q-tabs
        v-model="modelValue"
        dense
        class="bg-grey-3"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab
          v-for="tab in tabs"
          :key="tab.path"
          :name="tab.path"
          class="tab-item"
        >
          <div class="row items-center no-wrap q-gutter-x-xs">
            <q-icon :name="tab.icon" size="14px" />
            <div class="tab-label text-caption">{{ tab.label }}</div>
            <q-btn
              v-if="tab.path !== '/'"
              flat
              dense
              round
              icon="close"
              size="xs"
              class="close-btn"
              @click.stop="$emit('close-tab', tab.path)"
            />
          </div>
        </q-tab>
      </q-tabs>

      <q-btn
        flat
        dense
        icon="close"
        label="CERRAR TODO"
        class="close-all-btn"
        size="sm"
        @click="$emit('close-all')"
        :disable="tabs.length <= 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Tab } from '../composables/useNavigation';

defineProps<{
  modelValue: string;
  tabs: Tab[];
  drawerOpen: boolean;
}>();

defineEmits<{
  'update:modelValue': [value: string];
  'close-tab': [path: string];
  'close-all': [];
}>();
</script>

<style lang="scss" scoped>
.navigation-tabs {
  position: sticky;
  top: 50px;
  z-index: 100;
  background: #f5f5f5;
  transition: all 0.3s ease;
  margin-left: 0;
  width: 100%;
  
  &.drawer-open {
    margin-left: 240px;
    width: calc(100% - 240px);
  }
}

.tabs-wrapper {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  
  .q-tabs {
    flex: 1;
    min-height: 32px;
    
    :deep(.q-tab) {
      min-height: 32px;
      padding: 0 12px;
      margin: 0 2px;
      border-radius: 16px;
      font-size: 11px;
      
      &--active {
        background: var(--q-primary);
        color: white;
      }
    }
  }
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.close-btn {
  margin-left: 4px;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
}

.close-all-btn {
  margin-left: 8px;
  font-size: 11px;
  border-radius: 16px;
  height: 32px;
  padding: 0 12px;
  background: rgba(0, 0, 0, 0.05);
  
  &:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.1);
  }
}

.body--dark {
  .navigation-tabs {
    background: #1d1d1d;
  }
  
  .tabs-wrapper {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .close-all-btn {
    background: rgba(255, 255, 255, 0.1);
    
    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>