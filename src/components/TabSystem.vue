<template>
  <div class="tabs-wrapper">
    <div class="tabs-container" :style="{ marginLeft: drawerOpen ? '240px' : '0' }">
      <div class="row items-center q-px-md">
        <q-tabs
          v-model="modelValue"
          dense
          class="col"
          active-color="white"
          indicator-color="transparent"
          align="left"
          no-caps
        >
          <q-tab
            v-for="tab in tabs"
            :key="tab.path"
            :name="tab.path"
            class="custom-tab"
            :class="{ 'tab-active': modelValue === tab.path }"
          >
            <template v-slot:default>
              <div class="row items-center no-wrap q-gutter-x-xs">
                <q-icon :name="tab.icon" size="14px" />
                <div class="tab-label">{{ tab.label }}</div>
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
            </template>
          </q-tab>
        </q-tabs>

        <q-btn
          flat
          dense
          icon="close"
          label="CERRAR TODO"
          class="close-all-btn q-ml-sm"
          size="sm"
          @click="$emit('close-all')"
          :disable="tabs.length <= 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Tab {
  path: string;
  label: string;
  icon: string;
}

defineProps<{
  modelValue: string;
  tabs: Tab[];
  drawerOpen: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'close-tab', path: string): void;
  (e: 'close-all'): void;
}>();
</script>

<style lang="scss" scoped>
.tabs-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #bfc9ca;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.tabs-container {
  transition: margin-left 0.3s ease;
  padding: 4px 0;
  
  .custom-tab {
    min-height: 32px;
    padding: 0 12px;
    margin: 0 2px;
    border-radius: 16px;
    background: rgba(0, 0, 0, 0.1);
    font-size: 10px;
    
    &.tab-active {
      background: var(--q-primary);
    }
    
    .q-tab__content {
      min-height: 32px;
      padding: 0;
    }
    
    .q-icon {
      font-size: 14px;
      margin-right: 4px;
    }
    
    .tab-label {
      font-size: 10px;
      font-weight: 500;
      text-transform: uppercase;
      line-height: 1;
      white-space: nowrap;
    }
    
    .close-btn {
      opacity: 0.7;
      padding: 4px;
      margin-left: 4px;
      
      &:hover {
        opacity: 1;
      }
      
      .q-icon {
        font-size: 12px;
        margin: 0;
      }
    }
  }
  
  .close-all-btn {
    font-size: 10px;
    height: 32px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}

.body--dark {
  .tabs-wrapper {
    background: #1d1d1d;
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .tabs-container {
    .custom-tab {
      background: rgba(255, 255, 255, 0.1);
      
      &.tab-active {
        background: var(--q-primary);
      }
    }
    
    .close-all-btn {
      background: rgba(255, 255, 255, 0.1);
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}
</style>