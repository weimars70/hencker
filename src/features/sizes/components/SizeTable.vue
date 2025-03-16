<template>
  <div class="section-container">
    <div class="header-section q-mb-md">
      <h7 class="section-title">{{ title }}</h7>
      <div class="row items-center q-gutter-sm">
        <q-btn
          flat
          round
          dense
          :icon="isGridView ? 'view_list' : 'grid_view'"
          @click="toggleView"
        />

        <q-btn
          color="primary"
          class="excel-btn"
          @click="exportToExcel"
        >
          <div class="row items-center no-wrap">
            <img src="../../../assets/icons/excel-icon.svg" class="excel-icon q-mr-sm"/>
            <div class="gt-xs">Exportar a Excel</div>
          </div>
        </q-btn>

        <q-btn
          color="primary"
          icon="add"
          :label="addButtonLabel"
          @click="$emit('add')"
        />
      </div>
    </div>

    <!-- Table View -->
    <q-table
      v-if="!isGridView"
      :rows="sizes"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :filter="filter"
      flat
      bordered
    >
      <!-- Column Headers with Filters -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
            <template v-if="col.name !== 'actions'">
              <q-input
                v-model="columnFilters[col.name]"
                dense
                outlined
                class="q-mt-sm"
                placeholder="Filtrar..."
                @keyup.enter="onFilterChange"
                clearable
                clear-icon="close"
                @clear="clearFilter(col.name)"
              />
            </template>
            <template v-else>
              <div class="row justify-center q-mt-sm">
                <q-btn
                  color="primary"
                  icon="search"
                  label="Buscar"
                  @click="onFilterChange"
                  :loading="loading"
                  dense
                />
              </div>
            </template>
          </q-th>
        </q-tr>
      </template>

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
          <q-btn
            flat
            round
            color="negative"
            icon="delete"
            size="sm"
            @click="$emit('delete', props.row)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Grid View -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="size in sizes"
        :key="size.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="size-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-h6">#{{ size.id }}</div>
              <div class="row q-gutter-sm">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  size="sm"
                  @click="$emit('edit', size)"
                />
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click="$emit('delete', size)"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-gutter-sm">
              <div class="col-12">
                <div class="text-subtitle2">Código</div>
                <div>{{ size.codigo }}</div>
              </div>
              <div class="col-12">
                <div class="text-subtitle2">Nombre</div>
                <div>{{ size.nombre }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import * as XLSX from 'xlsx';
import type { Size } from '../domain/size.model';
import { useSizeTableColumns } from '../composables/useSizeTableColumns';

const props = defineProps<{
  sizes: Size[];
  loading: boolean;
  title?: string;
  addButtonLabel?: string;
}>();

const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'edit', size: Size): void;
  (e: 'delete', size: Size): void;
  (e: 'filter-change', filters: Record<string, string>): void;
}>();

const columns = useSizeTableColumns();
const isGridView = ref(false);
const columnFilters = ref<Record<string, string>>({});
const filter = ref('');

const title = computed(() => props.title || 'Gestión de Tallas');
const addButtonLabel = computed(() => props.addButtonLabel || 'Nueva Talla');

const toggleView = () => {
  isGridView.value = !isGridView.value;
};

const clearFilter = (columnName: string) => {
  columnFilters.value[columnName] = '';
  onFilterChange();
};

const onFilterChange = () => {
  const activeFilters = Object.entries(columnFilters.value).reduce((acc, [key, value]) => {
    if (value?.trim()) {
      acc[key] = value.trim();
    }
    return acc;
  }, {} as Record<string, string>);

  emit('filter-change', activeFilters);
};

const exportToExcel = () => {
  if (!props.sizes?.length) {
    return;
  }

  const exportData = props.sizes.map(size => ({
    ID: size.id,
    Código: size.codigo,
    Nombre: size.nombre
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tallas');
  XLSX.writeFile(wb, 'tallas.xlsx');
};
</script>

<style lang="scss" scoped>
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

.size-card {
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.excel-icon {
  width: 24px;
  height: 24px;
}

.excel-btn {
  padding: 0 16px;
}

@media (max-width: 599px) {
  .excel-btn {
    padding: 0 8px;
  }
  
  .excel-icon {
    margin-right: 0 !important;
  }
}
</style>