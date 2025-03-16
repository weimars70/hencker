<template>
  <div class="q-pa-md menu-container">
  <q-page>
    <div class="q-pa-md">
      <TableToolbar
        @register="openForm"
        @search="onSearch"
        @toggle-density="dense = !dense"
        @export="exportTable"
      />

      <q-dialog v-model="showForm" persistent>
        <q-card style="min-width: 350px">
          <q-card-section class="row items-center">
            <div class="text-h6">{{ editMode ? 'Editar' : 'Nuevo' }} Grupo</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <q-form @submit="saveItemGroup" class="q-gutter-md">
              <q-input 
                v-model="formData.codigo" 
                label="Código" 
                outlined
                dense
                readonly
              />
              <q-input 
                v-model="formData.nombre" 
                label="Nombre" 
                :rules="[val => !!val || 'El nombre es requerido']"
                outlined
                dense
              />
              <div class="row justify-end q-mt-md">
                <q-btn 
                  label="Cancelar" 
                  color="negative" 
                  flat 
                  v-close-popup
                  icon="close"
                />
                <q-btn 
                  label="Guardar" 
                  type="submit" 
                  color="primary" 
                  class="q-ml-sm"
                  :loading="saving"
                  icon="save"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-table
        ref="table"
        :rows="filteredGroups"
        :columns="columns"
        row-key="codigo"
        :loading="loading"
        :dense="dense"
        :filter="filter"
        :pagination="initialPagination"
        binary-state-sort
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn 
              flat 
              round 
              dense
              color="primary" 
              icon="edit" 
              @click="editItemGroup(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn 
              flat 
              round 
              dense
              color="negative" 
              icon="delete" 
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
      </q-table>
    </div>
  </q-page>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import TableToolbar from 'components/TableToolbar.vue';
import { exportFile } from 'quasar';

const $q = useQuasar();
const table = ref(null);
const itemGroups = ref<any[]>([]);
const formData = ref({ codigo: '', nombre: '' });
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const dense = ref(false);
const filter = ref('');
const editMode = ref(false);

const initialPagination = {
  sortBy: 'codigo',
  descending: false,
  page: 1,
  rowsPerPage: 10
};

const columns = [
  { 
    name: 'codigo', 
    label: 'Código', 
    field: 'codigo', 
    sortable: true, 
    align: 'left' 
  },
  { 
    name: 'nombre', 
    label: 'Nombre', 
    field: 'nombre', 
    sortable: true, 
    align: 'left' 
  },
  { 
    name: 'actions', 
    label: 'Acciones', 
    field: 'actions', 
    align: 'center' 
  }
];

const filteredGroups = computed(() => {
  if (!itemGroups.value) return [];
  if (!filter.value) return itemGroups.value;
  const searchTerm = filter.value.toLowerCase();
  return itemGroups.value.filter(group => 
    group?.name?.toLowerCase().includes(searchTerm)
  );
});

async function loadItemGroups() {
  try {
    loading.value = true;
    const response = await api.get('/items-grupos');
    itemGroups.value = response.data || [];
  } catch (error: any) {
    itemGroups.value = [];
    $q.notify({
      color: 'negative',
      message: `Error al cargar los grupos: ${error.message}`,
      icon: 'error',
      position: 'center'
    });
  } finally {
    loading.value = false;
  }
}

function openForm() {
  editMode.value = false;
  formData.value = { codigo: '', nombre: '' };
  showForm.value = true;
}

async function saveItemGroup() {
  try {
    saving.value = true;
    if (editMode.value) {
      await api.put(`/items-grupos/${formData.value.codigo}`, formData.value);
    } else {
      await api.post('/items-grupos', formData.value);
    }
    await loadItemGroups();
    showForm.value = false;
    $q.notify({
      color: 'positive',
      message: 'Grupo guardado exitosamente',
      icon: 'check',
      position: 'center'
    });
  } catch (error: any) {
    $q.notify({
      color: 'negative',
      message: `Error al guardar el grupo: ${error.message}`,
      icon: 'error',
      position: 'center'
    });
  } finally {
    saving.value = false;
  }
}

function editItemGroup(row: any) {
  editMode.value = true;
  formData.value = { ...row };
  showForm.value = true;
}

function confirmDelete(row: any) {
  $q.dialog({
    title: 'Confirmar',
    message: '¿Está seguro que desea eliminar este grupo?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/items-groups/${row.codigo}`);
      await loadItemGroups();
      $q.notify({
        color: 'positive',
        message: 'Grupo eliminado exitosamente',
        icon: 'check',
        position: 'center'
      });
    } catch (error: any) {
      $q.notify({
        color: 'negative',
        message: `Error al eliminar el grupo: ${error.message}`,
        icon: 'error',
        position: 'center'
      });
    }
  });
}

function onSearch(value: string) {
  filter.value = value;
}

function exportTable() {
  if (!itemGroups.value?.length) {
    $q.notify({
      message: 'No hay datos para exportar',
      color: 'warning',
      icon: 'warning',
      position: 'center'
    });
    return;
  }

  const content = itemGroups.value.map(row => `${row.codigo},${row.nombre}`).join('\n');
  const status = exportFile(
    'grupos.xlsx',
    `Código,Nombre\n${content}`,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  if (!status) {
    $q.notify({
      message: 'El navegador denegó la descarga del archivo',
      color: 'negative',
      icon: 'warning',
      position: 'center'
    });
  }
}

onMounted(() => {
  loadItemGroups();
});
</script>


<style lang="scss" scoped>

.menu-container {
  max-width: 700px;
}
.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.body--dark {
  .color-preview {
    border-color: rgba(255, 255, 255, 0.12);
  }
}
</style>