<template>
  <div class="q-mb-md row items-center justify-end q-gutter-x-sm">
    <q-input
      v-model="searchText"
      dense
      outlined
      :placeholder="t('common.search')"
      @update:model-value="$emit('search', $event)"
      style="width: 200px"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-btn
      flat
      round
      dense
      icon="view_list"
      class="text-secondary"
      @click="$emit('toggle-density')"
    >
      <q-tooltip>{{ t('common.toggleDensity') }}</q-tooltip>
    </q-btn>

    <q-btn
      class="bg-primary-custom"
      icon="add"
      :label="t('common.new')"
      rounded
      @click="$emit('register')"
    />
    
    <q-btn
      class="bg-primary-custom"
      icon="file_download"
      :label="t('common.export')"
      rounded
      @click="$emit('export')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const searchText = ref('');

defineEmits(['register', 'search', 'toggle-density', 'export']);
</script>

<style lang="scss" scoped>
.q-btn {
  &.text-secondary {
    color: #767b7b !important;
  }
}
</style>