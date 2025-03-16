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
      :rows="users"
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

      <!-- Table Body -->
      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- ID Column -->
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>

          <!-- Nombre Column -->
          <q-td key="nombre" :props="props">
            <div v-if="editingRow?.id === props.row.id">
              <q-input
                v-model="editingRow.nombre"
                dense
                outlined
                :rules="[val => !!val || 'Nombre es requerido']"
              />
            </div>
            <div v-else>
              {{ props.row.nombre }}
            </div>
          </q-td>

          <!-- Email Column -->
          <q-td key="email" :props="props">
            <div v-if="editingRow?.id === props.row.id">
              <q-input
                v-model="editingRow.email"
                dense
                outlined
                type="email"
                :rules="[
                  val => !!val || 'Email es requerido',
                  val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Email inválido'
                ]"
              />
            </div>
            <div v-else>
              {{ props.row.email }}
            </div>
          </q-td>

          <!-- Rol Column -->
          <q-td key="rol" :props="props">
            <div v-if="editingRow?.id === props.row.id">
              <q-select
                v-model="editingRow.rol"
                :options="roles"
                option-label="nombre"
                option-value="codigo"
                dense
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'Rol es requerido']"
              />
            </div>
            <div v-else>
              {{ props.row.rol_nombre || 'Sin rol' }}
            </div>
          </q-td>

          <!-- Actions Column -->
          <q-td key="actions" :props="props" class="q-gutter-x-sm">
            <template v-if="editingRow?.id === props.row.id">
              <q-btn
                flat
                round
                color="positive"
                icon="save"
                size="sm"
                @click="saveRow(props.row)"
              >
                <q-tooltip>Guardar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="close"
                size="sm"
                @click="cancelEdit"
              >
                <q-tooltip>Cancelar</q-tooltip>
              </q-btn>
            </template>
            <template v-else>
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                size="sm"
                @click="startEdit(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                size="sm"
                @click="$emit('delete', props.row)"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <!-- Grid View -->
    <div v-else class="row q-col-gutter-md">
      <div
        v-for="user in users"
        :key="user.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="user-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-h6">#{{ user.id }}</div>
              <div class="row q-gutter-sm">
                <template v-if="editingRow?.id === user.id">
                  <q-btn
                    flat
                    round
                    color="positive"
                    icon="save"
                    size="sm"
                    @click="saveRow(user)"
                  />
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="close"
                    size="sm"
                    @click="cancelEdit"
                  />
                </template>
                <template v-else>
                  <q-btn
                    flat
                    round
                    color="primary"
                    icon="edit"
                    size="sm"
                    @click="startEdit(user)"
                  />
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    size="sm"
                    @click="$emit('delete', user)"
                  />
                </template>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-gutter-sm">
              <div class="col-12">
                <div class="text-subtitle2">Nombre</div>
                <div v-if="editingRow?.id === user.id">
                  <q-input
                    v-model="editingRow.nombre"
                    dense
                    outlined
                    :rules="[val => !!val || 'Nombre es requerido']"
                  />
                </div>
                <div v-else>{{ user.nombre }}</div>
              </div>
              <div class="col-12">
                <div class="text-subtitle2">Email</div>
                <div v-if="editingRow?.id === user.id">
                  <q-input
                    v-model="editingRow.email"
                    dense
                    outlined
                    type="email"
                    :rules="[
                      val => !!val || 'Email es requerido',
                      val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Email inválido'
                    ]"
                  />
                </div>
                <div v-else>{{ user.email }}</div>
              </div>
              <div class="col-12">
                <div class="text-subtitle2">Rol</div>
                <div v-if="editingRow?.id === user.id">
                  <q-select
                    v-model="editingRow.rol"
                    :options="roles"
                    option-label="nombre"
                    option-value="codigo"
                    dense
                    outlined
                    emit-value
                    map-options
                    :rules="[val => !!val || 'Rol es requerido']"
                  />
                </div>
                <div v-else>{{ user.rol_nombre || 'Sin rol' }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as XLSX from 'xlsx';
import type { User } from '../domain/user.model';
import { useUserTableColumns } from '../composables/useUserTableColumns';
import { menuService } from 'src/services/menuServices';

const props = defineProps<{
  users: User[];
  loading: boolean;
  title?: string;
  addButtonLabel?: string;
}>();

const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'edit', user: User): void;
  (e: 'delete', user: User): void;
  (e: 'save', user: User): void;
  (e: 'filter-change', filters: Record<string, string>): void;
}>();

const columns = useUserTableColumns();
const isGridView = ref(false);
const columnFilters = ref<Record<string, string>>({});
const filter = ref('');
const editingRow = ref<User | null>(null);
const roles = ref([]);

const title = computed(() => props.title || 'Gestión de Usuarios');
const addButtonLabel = computed(() => props.addButtonLabel || 'Nuevo Usuario');

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

const startEdit = (user: User) => {
  editingRow.value = { ...user };
};

const cancelEdit = () => {
  editingRow.value = null;
};

const saveRow = (user: User) => {
  if (!editingRow.value) return;

  // Validate required fields
  if (!editingRow.value.nombre || !editingRow.value.email || !editingRow.value.rol) {
    return;
  }

  // Validate email format
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(editingRow.value.email)) {
    return;
  }

  emit('save', editingRow.value);
  editingRow.value = null;
};

const exportToExcel = () => {
  if (!props.users?.length) {
    return;
  }

  const exportData = props.users.map(user => ({
    ID: user.id,
    Nombre: user.nombre,
    Email: user.email,
    Rol: user.rol_nombre || 'Sin rol'
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
  XLSX.writeFile(wb, 'usuarios.xlsx');
};

const loadRoles = async () => {
  try {
    roles.value = await menuService.getRoles();
  } catch (error) {
    console.error('Error loading roles:', error);
  }
};

onMounted(() => {
  loadRoles();
});
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

.user-card {
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