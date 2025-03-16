<template>
  <div class="section-container">
    <div class="header-section q-mb-md">
      <h7 class="section-title">{{ title }}</h7>
      <q-btn
        color="primary"
        icon="add"
        :label="addButtonLabel"
        @click="$emit('add')"
      />
    </div>

    <q-table
      :rows="users"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            size="sm"
            @click="$emit('edit', props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '../domain/user.model';
import { useUserTableColumns } from '../composables/useUserTableColumns';

const props = defineProps<{
  users: User[];
  loading: boolean;
  title?: string;
  addButtonLabel?: string;
}>();

const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'edit', user: User): void;
}>();

const columns = useUserTableColumns();

const title = computed(() => props.title || 'Gestión de Usuarios');
const addButtonLabel = computed(() => props.addButtonLabel || 'Nuevo Usuario');
</script>

<style scoped>
.section-container {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  margin: 0;
  color: #1976d2;
  font-weight: 500;
}
</style>