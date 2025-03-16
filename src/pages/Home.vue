<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <h1 class="text-h3 q-mb-md">{{ t('home.welcome') }}</h1>
      <p class="text-h6 text-grey-7">{{ t('home.selectOption') }}</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>