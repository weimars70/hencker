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
            <div class="text-h6">{{ editMode ? t('colors.editColor') : t('Nuevo Color') }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <q-form @submit="saveColor" class="q-gutter-md">
              <q-input 
                v-model="formData.codigo" 
                :label="t('Codigo')"
                outlined
                dense
                readonly
              />
              <q-input 
                v-model="formData.nombre" 
                :label="t('Nombre')"
                :rules="[val => !!val || t('validation.required')]"
                outlined
                dense
              />
            
              <div class="row justify-end q-mt-md">
                <q-btn 
                  :label="t('common.cancel')"
                  color="negative" 
                  flat 
                  v-close-popup
                  icon="close"
                />
                <q-btn 
                  :label="t('common.save')"
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
        :rows="filteredColors"
        :columns="columns"
        row-key="codigo"
        :loading="loading"
        :dense="dense"
        :filter="filter"
        :pagination="initialPagination"
        binary-state-sort
      >
        <template v-slot:body-cell-hex="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm">
              <div 
                class="color-preview" 
                :style="{ backgroundColor: props.value }"
              ></div>
              <div>{{ props.value }}</div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn 
              flat 
              round 
              dense
              color="primary" 
              icon="edit" 
              @click="editColor(props.row)"
            >
              <q-tooltip>{{ t('common.edit') }}</q-tooltip>
            </q-btn>
            <q-btn 
              flat 
              round 
              dense
              color="negative" 
              icon="delete" 
              @click="confirmDelete(props.row)"
            >
              <q-tooltip>{{ t('common.delete') }}</q-tooltip>
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
import { useI18n } from 'vue-i18n';
import TableToolbar from 'components/TableToolbar.vue';
import { exportFile } from 'quasar';

const $q = useQuasar();
const { t } = useI18n();

const table = ref(null);
const colors = ref<any[]>([]);
const formData = ref({ id: null, codigo: '', nombre: '', hex: '#000000' });
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

const columns = computed(() => [
  { 
    name: 'codigo', 
    label: t('Codigo'), 
    field: 'codigo', 
    sortable: true, 
    align: 'left' 
  },
  { 
    name: 'nombre', 
    label: t('Nombre'), 
    field: 'nombre', 
    sortable: true, 
    align: 'left' 
  },
  { 
    name: 'actions', 
    label: t('common.actions'), 
    field: 'actions', 
    align: 'center' 
  }
]);

const filteredColors = computed(() => {
  if (!colors.value) return [];
  if (!filter.value) return colors.value;
  const searchTerm = filter.value.toLowerCase();
  return colors.value.filter(color => 
    color?.nombre?.toLowerCase().includes(searchTerm));
});

async function loadColors() {
  try {
    loading.value = true;
    const response = await api.get('/colores');
    colors.value = response.data || [];
  } catch (error: any) {
    colors.value = [];
    $q.notify({
      color: 'negative',
      message: t('colors.loadError') + ': ' + error.message,
      icon: 'error',
      position: 'center'
    });
  } finally {
    loading.value = false;
  }
}

function openForm() {
  editMode.value = false;
  formData.value = { codigo: '', nombre: ''};
  showForm.value = true;
}

async function saveColor() {
  try {
    saving.value = true;
    if (editMode.value) {
      await api.put(`/colores/${formData.value.codigo}`, formData.value);
    } else {
      await api.post('/colores', formData.value);
    }
    await loadColors();
    showForm.value = false;
    $q.notify({
      color: 'positive',
      message: t('colors.saveSuccess'),
      icon: 'check',
      position: 'center'
    });
  } catch (error: any) {
    $q.notify({
      color: 'negative',
      message: t('colors.saveError') + ': ' + error.message,
      icon: 'error',
      position: 'center'
    });
  } finally {
    saving.value = false;
  }
}

function editColor(row: any) {
  editMode.value = true;
  formData.value = { ...row };
  showForm.value = true;
}

function confirmDelete(row: any) {
  $q.dialog({
    title: t('common.confirm'),
    message: t('colors.deleteConfirm'),
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/colors/${row.id}`);
      await loadColors();
      $q.notify({
        color: 'positive',
        message: t('colors.deleteSuccess'),
        icon: 'check',
        position: 'center'
      });
    } catch (error: any) {
      $q.notify({
        color: 'negative',
        message: t('colors.deleteError') + ': ' + error.message,
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
  if (!colors.value?.length) {
    $q.notify({
      message: t('common.noDataToExport'),
      color: 'warning',
      icon: 'warning',
      position: 'center'
    });
    return;
  }

  const content = colors.value.map(row => `${row.codigo},${row.nombre}`).join('\n');
  const status = exportFile(
    'colores.xlsx',
    `${t('colors.codigo')},${t('colors.nombre')},\n${content}`,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  if (!status) {
    $q.notify({
      message: t('common.exportError'),
      color: 'negative',
      icon: 'warning',
      position: 'center'
    });
  }
}

onMounted(() => {
  loadColors();
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