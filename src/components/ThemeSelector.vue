<template>
  <q-btn-dropdown
    flat
    dense
    :label="currentTheme.name"
    class="q-mr-md text-white"
  >
    <q-list style="min-width: 250px">
      <q-item
        v-for="theme in themes"
        :key="theme.name"
        clickable
        v-close-popup
        @click="selectTheme(theme)"
        class="q-py-md"
      >
        <q-item-section avatar>
          <div class="theme-preview">
            <div class="color-strip" :style="{ background: `#${theme.primary}` }"></div>
            <div class="color-strip" :style="{ background: `#${theme.secondary}` }"></div>
            <div class="color-strip" :style="{ background: `#${theme.accent}` }"></div>
            <div class="color-strip" :style="{ background: `#${theme.background}` }"></div>
          </div>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ theme.name }}</q-item-label>
          <q-item-label caption class="row q-gutter-x-sm">
            <span class="color-code">#{{ theme.primary }}</span>
            <span class="color-code">#{{ theme.secondary }}</span>
            <span class="color-code">#{{ theme.accent }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme';

const { currentTheme, themes, setTheme } = useTheme();

function selectTheme(theme) {
  setTheme(theme);
}
</script>

<style lang="scss" scoped>
.theme-preview {
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  
  .color-strip {
    flex: 1;
    height: 100%;
  }
}

.color-code {
  font-family: monospace;
  font-size: 11px;
  padding: 2px 4px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.05);
}

.body--dark {
  .theme-preview {
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .color-code {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>