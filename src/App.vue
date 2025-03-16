<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import { useAppStore } from './stores/app';
import { useTheme } from './boot/theme';

const $q = useQuasar();
const store = useAppStore();
const { darkMode } = storeToRefs(store);
const { themes, setTheme } = useTheme();

onMounted(() => {
  $q.dark.set(darkMode.value);
  setTheme(themes[0]); // Set default theme
});
</script>

<style lang="scss">
:root {
  --primary: #3498db;
  --secondary: #1abc9c;
  --accent: #e8f6f3;
}
</style>