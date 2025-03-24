<template>
  <q-select
    v-model="selectedBranch"
    :options="branches"
    dense
    outlined
    class="branch-select q-mr-md"
    label="Empresa"
    bg-color="white"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedBranch = ref('main');
const branches = [
  { label: 'Principal', value: 'main' },
  { label: 'Empresa 1', value: 'branch1' },
  { label: 'Empresa 2', value: 'branch2' }
];
</script>

<style lang="scss" scoped>
.branch-select {
  width: 200px;
  
  :deep(.q-field__control) {
    height: 32px;
  }
}
</style>