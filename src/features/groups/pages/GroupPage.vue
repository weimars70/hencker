<template>
  <q-page padding>
    <div class="group-page">
      <!-- Header Section with Integrated Search -->
      <div class="page-header">
        <div class="row items-center justify-between full-width q-mb-md">
          <div class="text-h5 text-weight-bold text-primary q-my-none">Gestión de Grupos</div>
          <div class="row items-center q-gutter-sm header-actions">
            <!-- Highlighted Search Input -->
            <q-input
              v-model="searchText"
              placeholder="Buscar grupos..."
              outlined
              dense
              class="search-input"
              bg-color="blue-1"
              @update:model-value="handleSearch"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="searchText"
                  name="close"
                  class="cursor-pointer"
                  color="primary"
                  @click="clearSearch"
                />
              </template>
            </q-input>

            <q-btn-group outline>
              <q-btn
                :color="viewMode === 'grid' ? 'primary' : 'grey'"
                icon="grid_view"
                @click="viewMode = 'grid'"
              >
                <q-tooltip>Vista Cuadrícula</q-tooltip>
              </q-btn>
              <q-btn
                :color="viewMode === 'list' ? 'primary' : 'grey'"
                icon="view_list"
                @click="viewMode = 'list'"
              >
                <q-tooltip>Vista Lista</q-tooltip>
              </q-btn>
            </q-btn-group>

            <q-btn
              color="primary"
              icon="file_download"
              label="Exportar"
              class="q-px-md export-btn"
              @click="exportToExcel"
            >
              <q-tooltip>Exportar a Excel</q-tooltip>
            </q-btn>

            <q-btn
              color="primary"
              icon="add"
              label="Nuevo Grupo"
              class="q-px-md"
              @click="openCreateDialog"
            />
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid-view">
        <transition-group
          name="group-grid"
          tag="div"
          class="row q-col-gutter-md"
        >
          <div
            v-for="group in filteredGroups"
            :key="group.codigo"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card class="group-card">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-bold">{{ group.nombre }}</div>
                    <div class="text-caption text-grey">{{ group.codigo }}</div>
                  </div>
                  <div class="row q-gutter-x-sm">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="edit"
                      size="sm"
                      @click="openEditDialog(group)"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      size="sm"
                      @click="confirmDelete(group)"
                    >
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </transition-group>
      </div>

      <!-- List View -->
      <div v-else class="list-view">
        <q-table
          :rows="filteredGroups"
          :columns="columns"
          row-key="codigo"
          :loading="loading"
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                size="sm"
                @click="openEditDialog(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                size="sm"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing color="primary">
              <q-spinner size="50px" color="primary" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-grey-6">
              No se encontraron grupos
            </div>
          </template>
        </q-table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredGroups.length === 0" class="empty-state">
        <q-icon name="category" size="4rem" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">No hay grupos disponibles</div>
        <div class="text-grey-6 q-mb-md">Agregue un nuevo grupo para comenzar</div>
        <q-btn
          color="primary"
          icon="add"
          label="Nuevo Grupo"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- Group Form Dialog -->
    <GroupForm
      v-model="showForm"
      :group="editingGroup"
      :loading="saving"
      @submit="saveGroup"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import * as XLSX from 'xlsx';
import GroupForm from '../components/GroupForm.vue';
import { GroupApi } from '../infrastructure/group.api';
import type { Group } from '../domain/group.model';
import { useGroupTableColumns } from '../composables/useGroupTableColumns';

const $q = useQuasar();
const groupRepository = new GroupApi();

const groups = ref<Group[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingGroup = ref<Group | null>(null);
const searchText = ref('');
const viewMode = ref<'grid' | 'list'>('list');

const columns = useGroupTableColumns();

const filteredGroups = computed(() => {
  if (!searchText.value) return groups.value;
  
  const search = searchText.value.toLowerCase();
  return groups.value.filter(group => 
    group.nombre.toString().toLowerCase().includes(search) ||
    group.codigo.toString().toLowerCase().includes(search)
  );
});

const loadGroups = async () => {
  loading.value = true;
  try {
    groups.value = await groupRepository.getGroups();
  } catch (error) {
    console.error('Error loading groups:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar grupos',
      position: 'center'
    });
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  // The filtering is handled by the computed property
};

const clearSearch = () => {
  searchText.value = '';
};

const openCreateDialog = () => {
  editingGroup.value = null;
  showForm.value = true;
};

const openEditDialog = (group: Group) => {
  editingGroup.value = { ...group };
  showForm.value = true;
};

const saveGroup = async (formData: Partial<Group>) => {
  saving.value = true;
  try {
    if (editingGroup.value) {
      await groupRepository.updateGroup({
        codigo: editingGroup.value.codigo,
        nombre: formData.nombre!
      });
    } else {
      await groupRepository.createGroup({
        nombre: formData.nombre!
      });
    }
    
    await loadGroups();
    showForm.value = false;
    editingGroup.value = null;
    
    $q.notify({
      type: 'positive',
      message: `Grupo ${editingGroup.value ? 'actualizado' : 'creado'} exitosamente`,
      position: 'center'
    });
  } catch (error) {
    console.error('Error saving group:', error);
    $q.notify({
      type: 'negative',
      message: `Error al ${editingGroup.value ? 'actualizar' : 'crear'} el grupo`,
      position: 'center'
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (group: Group) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro que desea eliminar el grupo ${group.nombre}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await groupRepository.deleteGroup(group.codigo);
      await loadGroups();
      
      $q.notify({
        type: 'positive',
        message: 'Grupo eliminado exitosamente',
        position: 'center'
      });
    } catch (error) {
      console.error('Error deleting group:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al eliminar el grupo',
        position: 'center'
      });
    }
  });
};

const exportToExcel = () => {
  if (!groups.value?.length) {
    $q.notify({
      type: 'warning',
      message: 'No hay datos para exportar',
      position: 'center'
    });
    return;
  }

  const exportData = groups.value.map(group => ({
    Código: group.codigo,
    Nombre: group.nombre
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Grupos');
  XLSX.writeFile(wb, 'grupos.xlsx');
};

loadGroups();
</script>

<style lang="scss" scoped>
.group-page {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  .header-actions {
    flex-wrap: nowrap;
    min-height: 40px;
  }
}

.search-input {
  width: 300px;
  transition: all 0.3s ease;

  :deep(.q-field__control) {
    background: rgba(25, 118, 210, 0.04);
    
    &:hover {
      background: rgba(25, 118, 210, 0.08);
    }
    
    &.q-field__control--focused {
      background: rgba(25, 118, 210, 0.12);
    }
  }

  &.q-field--focused {
    width: 350px;
  }
}

.group-card {
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

// Grid Transitions
.group-grid-move {
  transition: transform 0.5s ease;
}

.group-grid-enter-active,
.group-grid-leave-active {
  transition: all 0.5s ease;
}

.group-grid-enter-from,
.group-grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

// Responsive Adjustments
@media (max-width: 959px) {
  .page-header {
    .header-actions {
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .search-input {
      width: 250px;
      
      &.q-field--focused {
        width: 300px;
      }
    }
  }
}

@media (max-width: 599px) {
  .page-header {
    .row {
      flex-direction: column;
      align-items: stretch;
      
      .text-h5 {
        text-align: center;
        margin-bottom: 1rem;
      }
      
      .header-actions {
        justify-content: center;
        flex-wrap: wrap;
      }
    }

    .search-input {
      width: 100%;
      
      &.q-field--focused {
        width: 100%;
      }
    }
  }
  
  .export-btn {
    .q-btn__content > div {
      display: none;
    }
  }
}

// Dark Mode Adjustments
.body--dark {
  .group-card {
    background: #1d1d1d;
    
    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
  }

  .search-input {
    :deep(.q-field__control) {
      background: rgba(255, 255, 255, 0.04);
      
      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
      
      &.q-field__control--focused {
        background: rgba(255, 255, 255, 0.12);
      }
    }
  }
}
</style>