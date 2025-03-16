<template>
  <q-page padding>
    <!-- Role Section -->
    <div class="section-container">
      <h7 class="section-title q-mb-xs">Gestión de Permisos Rol</h7>
      <div class="q-mb-md">
        <q-select
          v-model="selectedRole"
          :options="roles"
          option-label="nombre"
          option-value="codigo"
          label="Seleccionar Rol"
          :loading="loadingRoles"
          :disable="loadingRoles"
          outlined
          emit-value
          map-options
          @update:model-value="onRoleChange"
        />
      </div>
    </div>

    <!-- Tree Section -->
    <div class="section-container">
      <h7 class="section-title q-mb-xs">Menú de Permisos</h7>
      <q-tree
        :nodes="treeData"
        node-key="path"
        tick-strategy="strict"
        default-expand-all
        :ticked.sync="selectedItems"
        :expanded.sync="expandedNodes"
        @update:ticked="updateSelection"
      >
        <template v-slot:default-header="prop">
          <div class="row items-center">
            <q-icon 
              :name="prop.node.icon" 
              size="sm" 
              class="q-mr-sm"
              v-if="prop.node.icon"
            />
            <div>{{ prop.node.label }}</div>
          </div>
        </template>
      </q-tree>
    </div>

    <div class="q-mt-sm">
      <q-btn 
        color="primary"
        label="Guardar Selección"
        @click="saveSelection"
        :loading="saving"
        :disable="!selectedRole"
      />
    </div>

    <!-- Selected Items JSON Display -->
    <div class="q-mt-sm">
      <p class="text-weight-bold">Items Seleccionados:</p>
      <q-card class="bg-grey-2">
        <q-card-section>
          <pre class="json-display">{{ JSON.stringify(getSelectedNodesData(), null, 2) }}</pre>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useTreeLogic } from '../composables/useTreeLogic';

const {
  treeData,
  selectedItems,
  expandedNodes,
  saving,
  updateSelection,
  saveSelection,
  getSelectedNodesData,
  roles,
  selectedRole,
  loadingRoles,
  onRoleChange
} = useTreeLogic();
</script>

<style scoped>
.q-tree {
  margin: 0.5rem;
}

.json-display {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  margin: 0;
  padding: 4px;
}

.section-title {
  margin: 0;
  color: #1976d2;
  font-weight: 500;
}

.section-container {
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.75rem;
}
</style>