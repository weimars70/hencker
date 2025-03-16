<template>
  <q-header class="bg-primary" style="height: 50px">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="$emit('toggle-drawer')"
      />
      
      <q-toolbar-title class="text-weight-bold">
        Sistema ERP
      </q-toolbar-title>

      <branch-selector />
      <theme-selector />
      <dark-mode-toggle />
      <language-selector />
      <user-menu />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import BranchSelector from './header/BranchSelector.vue';
import ThemeSelector from './header/ThemeSelector.vue';
import DarkModeToggle from './header/DarkModeToggle.vue';
import LanguageSelector from './header/LanguageSelector.vue';
import UserMenu from './header/UserMenu.vue';

defineProps<{
  drawerOpen: boolean;
}>();

defineEmits<{
  'toggle-drawer': [];
}>();
</script>

<style lang="scss" scoped>
.q-toolbar {
  min-height: 50px;
  padding: 0 16px;
}
</style>