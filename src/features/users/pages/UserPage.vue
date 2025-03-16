<template>
  <q-page padding>
    <div class="user-page">
      <!-- Header Section with Integrated Search -->
      <div class="page-header">
        <div class="row items-center justify-between full-width q-mb-md">
          <div class="text-h5 text-weight-bold text-primary q-my-none">Gestión de Usuarios</div>
          <div class="row items-center q-gutter-sm header-actions">
            <!-- Highlighted Search Input -->
            <q-input
              v-model="searchText"
              placeholder="Buscar usuarios..."
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
              label="Nuevo Usuario"
              class="q-px-md"
              @click="openCreateDialog"
            />
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid-view">
        <transition-group
          name="user-grid"
          tag="div"
          class="row q-col-gutter-md"
        >
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card class="user-card">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-subtitle1 text-weight-bold">{{ user.nombre }}</div>
                    <div class="text-caption text-grey">{{ user.email }}</div>
                    <div class="text-caption text-primary">{{ user.rol_nombre || 'Sin rol' }}</div>
                  </div>
                  <div class="row q-gutter-x-sm">
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="edit"
                      size="sm"
                      @click="openEditDialog(user)"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      size="sm"
                      @click="confirmDelete(user)"
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
          :rows="filteredUsers"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
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
                    @update:model-value="handleColumnFilter"
                    clearable
                    clear-icon="close"
                  />
                </template>
              </q-th>
            </q-tr>
          </template>

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
              No se encontraron usuarios
            </div>
          </template>
        </q-table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredUsers.length === 0" class="empty-state">
        <q-icon name="people" size="4rem" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">No hay usuarios disponibles</div>
        <div class="text-grey-6 q-mb-md">Agregue un nuevo usuario para comenzar</div>
        <q-btn
          color="primary"
          icon="add"
          label="Nuevo Usuario"
          @click="openCreateDialog"
        />
      </div>
    </div>

    <!-- User Form Dialog -->
    <UserForm
      v-model="showForm"
      :user="editingUser"
      :loading="saving"
      @submit="saveUser"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import * as XLSX from 'xlsx';
import UserForm from '../components/UserForm.vue';
import { UserApi } from '../infrastructure/user.api';
import type { User } from '../domain/user.model';
import { useUserTableColumns } from '../composables/useUserTableColumns';

const $q = useQuasar();
const userRepository = new UserApi();

const users = ref<User[]>([]);
const loading = ref(false);
const saving = ref(false);
const showForm = ref(false);
const editingUser = ref<User | null>(null);
const searchText = ref('');
const viewMode = ref<'grid' | 'list'>('grid');
const columnFilters = ref<Record<string, string>>({});

const columns = useUserTableColumns();

const filteredUsers = computed(() => {
  let filtered = users.value;

  // Apply column filters
  Object.entries(columnFilters.value).forEach(([key, value]) => {
    if (value?.trim()) {
      const search = value.toLowerCase().trim();
      filtered = filtered.filter(user => {
        const fieldValue = key === 'rol' ? 
          (user.rol_nombre || 'Sin rol').toLowerCase() :
          String(user[key as keyof User] || '').toLowerCase();
        return fieldValue.includes(search);
      });
    }
  });

  // Apply global search
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    filtered = filtered.filter(user =>
      user.nombre.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      (user.rol_nombre || 'Sin rol').toLowerCase().includes(search)
    );
  }

  return filtered;
});

const loadUsers = async () => {
  loading.value = true;
  try {
    users.value = await userRepository.getUsers();
  } catch (error) {
    console.error('Error loading users:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al cargar usuarios',
      position: 'center'
    });
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  // The filtering is handled by the computed property
};

const handleColumnFilter = () => {
  // The filtering is handled by the computed property
};

const clearSearch = () => {
  searchText.value = '';
};

const openCreateDialog = () => {
  editingUser.value = null;
  showForm.value = true;
};

const openEditDialog = (user: User) => {
  editingUser.value = { ...user };
  showForm.value = true;
};

const saveUser = async (formData: Partial<User>) => {
  saving.value = true;
  try {
    if (editingUser.value) {
      await userRepository.updateUser({
        id: editingUser.value.id,
        ...formData
      });
    } else {
      await userRepository.createUser(formData);
    }
    
    await loadUsers();
    showForm.value = false;
    editingUser.value = null;
    
    $q.notify({
      type: 'positive',
      message: `Usuario ${editingUser.value ? 'actualizado' : 'creado'} exitosamente`,
      position: 'center'
    });
  } catch (error) {
    console.error('Error saving user:', error);
    $q.notify({
      type: 'negative',
      message: `Error al ${editingUser.value ? 'actualizar' : 'crear'} el usuario`,
      position: 'center'
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (user: User) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Está seguro que desea eliminar el usuario ${user.nombre}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await userRepository.deleteUser(user.id!);
      await loadUsers();
      
      $q.notify({
        type: 'positive',
        message: 'Usuario eliminado exitosamente',
        position: 'center'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al eliminar el usuario',
        position: 'center'
      });
    }
  });
};

const exportToExcel = () => {
  if (!users.value?.length) {
    $q.notify({
      type: 'warning',
      message: 'No hay datos para exportar',
      position: 'center'
    });
    return;
  }

  const exportData = users.value.map(user => ({
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

loadUsers();
</script>

<style lang="scss" scoped>
.user-page {
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

.user-card {
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
.user-grid-move {
  transition: transform 0.5s ease;
}

.user-grid-enter-active,
.user-grid-leave-active {
  transition: all 0.5s ease;
}

.user-grid-enter-from,
.user-grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

// Column Filters
:deep(.q-table) {
  th {
    padding: 8px 16px;
    
    .q-input {
      min-width: 150px;
      
      .q-field__control {
        height: 32px;
        background: rgba(25, 118, 210, 0.04);
        
        &:hover {
          background: rgba(25, 118, 210, 0.08);
        }
      }
    }
  }
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
  .user-card {
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

  :deep(.q-table) {
    th {
      .q-input {
        .q-field__control {
          background: rgba(255, 255, 255, 0.04);
          
          &:hover {
            background: rgba(255, 255, 255, 0.08);
          }
        }
      }
    }
  }
}
</style>