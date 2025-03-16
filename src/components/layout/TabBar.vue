<template>
  <div class="tab-bar-container" :class="{ 'drawer-open': drawerOpen }">
    <div class="row items-center">
      <q-tabs
        v-model="currentTab"
        dense
        class="col"
        active-color="red"
        indicator-color="transparent"
        align="left"
      >
        <q-tab
          v-for="tab in tabs"
          :key="tab.path"
          :name="tab.path"
          class="custom-tab"
          @click="$emit('tab-click', tab.path)"
        >
          <div class="row items-center no-wrap q-gutter-x-xs">
            <q-icon :name="tab.icon" size="16px" />
            <div class="tab-label text-weight-medium">{{ tab.label }}</div>
            <q-btn
              v-if="tab.path !== '/'"
              flat
              round
              dense
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
        class="close-all-btn q-ml-sm"
        size="sm"
        @click="$emit('close-all')"
        :disable="tabs.length <= 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Tab } from 'src/stores/tab_old';

const props = defineProps<{
  modelValue: string;
  tabs: Tab[];
  drawerOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'tab-click', path: string): void;
  (e: 'close-tab', path: string): void;
  (e: 'close-all'): void;
}>();

const currentTab = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<style lang="scss" scoped>
.tab-bar-container {
  padding: 4px 8px;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  background: #828684;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  width: 100%;

  &.drawer-open {
    left: 240px;
    width: calc(100% - 240px);
  }

  .custom-tab {
    min-height: 32px;
    padding: 0 12px;
    margin: 0 2px;
    border-radius: 16px;
    font-size: 12px;
    background: #2ecc71;
    color: black;
    transition: all 0.3s ease;

    &:hover {
      background: #27ae60;
    }

    &.q-tab--active {
      background: #27ae60;
      
      .tab-label {
        color: red;
      }
    }

    .tab-label {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }

    .close-btn {
      opacity: 0.8;
      transition: opacity 0.2s ease;
      background: rgba(255, 255, 255, 0.2);
      margin-left: 8px;
      width: 18px;
      height: 18px;
      
      .q-icon {
        font-size: 14px;
      }

      &:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }

  .close-all-btn {
    font-size: 11px;
    height: 32px;
    border-radius: 16px;
    color: black;
    background: #2ecc71;
    font-weight: 500;
    padding: 0 12px;

    &:hover:not(:disabled) {
      background: #27ae60;
    }

    &:disabled {
      opacity: 0.5;
    }
  }
}

.body--dark {
  .tab-bar-container {
    background: #2c3e50;

    .custom-tab {
      background: #27ae60;

      &:hover {
        background: #219a52;
      }

      &.q-tab--active {
        background: #219a52;
      }
    }

    .close-all-btn {
      background: #27ae60;

      &:hover:not(:disabled) {
        background: #219a52;
      }
    }
  }
}
</style>