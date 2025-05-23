<template>
  <q-page padding>
    <div class="size-page">
      <!-- Header Section with Integrated Search -->
      <div class="page-header">
        <div class="row items-center justify-between full-width q-mb-md">
          <div class="text-h5 text-weight-bold text-primary q-my-none">Gestión de Tallas</div>
          <div class="row items-center q-gutter-sm header-actions">
            <!-- Highlighted Search Input -->
            <q-input
              v-model="searchText"
              placeholder="Buscar tallas..."
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
              label="Nueva Talla"
              class="q-px-md"
              @click="openCreateDialog"
            />
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid-view">
        <transition-group
          name="size-grid"
          tag="div"
          class="row q-col-gutter-md"
        >
          <div
            v-for="size in filteredSizes"
            :key="size.codigo"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card class="size-card">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-bold">{{ size.nombre }}</div>
                    <div class="text-caption text-grey">{{ size.codigo }}</div>
                  </div>
                  <div class="row q-gutter-x-sm">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="edit"
                      size="sm"
                      @click="openEditDialog(size)"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      size="sm"
                      @click="confirmDelete(size)"
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
          :rows="filteredSizes"
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
              No se encontraron tallas
            </div>
          </template>
        </q-table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredSizes.length === 0" class="empty-state">
        <q-icon name="straighten" size="4rem" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">No hay tallas disponibles</div>
        <div class="text-grey-6 q-mb-md">Agregue una nueva talla para comenzar</div>
        <q-btn
          color="primary"
          icon="add"
          label="Nueva Talla"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- Size Form Dialog -->
    <SizeForm
      v-model="showForm"
      :size="editingSize"
      :loading="saving"
      @submit="saveSize"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import * as XLSX from 'xlsx';
import SizeForm from '../components/SizeForm.vue';
import { SizeApi } from '../infrastructure/size.api';
import type { Size } from '../domain/size.model';
import { useSizeTableColumns } from '../composables/useSizeTableColumns';

const $q = useQuasar();
const sizeRepository = new SizeApi();

const sizes = ref<Size[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingSize = ref<Size | null>(null);
const searchText = ref('');
const viewMode = ref<'grid' | 'list'>('grid');

const columns = useSizeTableColumns();

const filteredSizes = computed(() => {
  if (!searchText.value) return sizes.value;
  
  const search = searchText.value.toLowerCase();
  return sizes.value.filter(size => 
    size.nombre.toString().toLowerCase().includes(search) ||
    size.codigo.toString().toLowerCase().includes(search)
  );
});

const loadSizes = async () => {
  loading.value = true;
  try {
    sizes.value = await sizeRepository.getSizes();
  } catch (error) {
    console.error('Error loading sizes:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar tallas',
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
  editingSize.value = null;
  showForm.value = true;
};

const openEditDialog = (size: Size) => {
  editingSize.value = { ...size };
  showForm.value = true;
};

const saveSize = async (formData: Partial<Size>) => {
  saving.value = true;
  try {
    if (editingSize.value) {
      await sizeRepository.updateSize({
        codigo: editingSize.value.codigo,
        nombre: formData.nombre!
      });
    } else {
      await sizeRepository.createSize({
        codigo: formData.codigo!,
        nombre: formData.nombre!
      });
    }
    
    await loadSizes();
    showForm.value = false;
    editingSize.value = null;
    
    $q.notify({
      type: 'positive',
      message: `Talla ${editingSize.value ? 'actualizada' : 'creada'} exitosamente`,
      position: 'center'
    });
  } catch (error) {
    console.error('Error saving size:', error);
    $q.notify({
      type: 'negative',
      message: `Error al ${editingSize.value ? 'actualizar' : 'crear'} la talla`,
      position: 'center'
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (size: Size) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro que desea eliminar la talla ${size.nombre}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await sizeRepository.deleteSize(size.codigo);
      await loadSizes();
      
      $q.notify({
        type: 'positive',
        message: 'Talla eliminada exitosamente',
        position: 'center'
      });
    } catch (error) {
      console.error('Error deleting size:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al eliminar la talla',
        position: 'center'
      });
    }
  });
};

const exportToExcel = () => {
  if (!sizes.value?.length) {
    $q.notify({
      type: 'warning',
      message: 'No hay datos para exportar',
      position: 'center'
    });
    return;
  }

  const exportData = sizes.value.map(size => ({
    Código: size.codigo,
    Nombre: size.nombre
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tallas');
  XLSX.writeFile(wb, 'tallas.xlsx');
};

loadSizes();
</script>

<style lang="scss" scoped>
.size-page {
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

.size-card {
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
.size-grid-move {
  transition: transform 0.5s ease;
}

.size-grid-enter-active,
.size-grid-leave-active {
  transition: all 0.5s ease;
}

.size-grid-enter-from,
.size-grid-leave-to {
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
  .size-card {
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