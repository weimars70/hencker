<template>
  <q-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    show-if-above
    bordered
    :width="240"
    class="bg-grey-1"
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <q-item-label header class="text-weight-bold text-primary">
          MENÚ
        </q-item-label>

        <q-item
          v-for="item in menuItems"
          :key="item.path"
          clickable
          v-ripple
          :active="currentTab === item.path"
          @click="$emit('select-item', item)"
          class="drawer-item"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  currentTab: string;
  menuItems: Array<{
    path: string;
    label: string;
    icon: string;
  }>;
}>();

defineEmits<{
  'update:modelValue': [value: boolean];
  'select-item': [item: { path: string; label: string; icon: string }];
}>();
</script>

<style lang="scss" scoped>
.drawer-item {
  border-radius: 8px;
  margin: 2px 4px;
  height: 40px;
  
  &.q-item--active {
    background: var(--q-primary);
    color: rgb(230, 11, 19);
  }
}

.body--dark {
  .q-drawer {
    background: #121212;
  }
}
</style>