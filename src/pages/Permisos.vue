<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { menuService } from '../services/menuServices'
import type { MenuNode } from '../types/menu'

const $q = useQuasar()

const menuItems = ref<MenuNode[]>([])
const loading = ref(true)

const expanded = ref<string[]>([])
const dialog = ref({
  show: false,
  label: '',
  icon: '',
  isEdit: false,
  parentNode: null as MenuNode | null,
  currentNode: null as MenuNode | null,
  iconError: false
})

const materialIcons = [
 'home', 'menu', 'dashboard', 'apps', 'arrow_back', 'arrow_forward',
  'expand_more', 'expand_less', 'more_vert', 'more_horiz',
  'settings', 'build', 'edit', 'delete', 'add', 'remove',
  'search', 'refresh', 'filter_list', 'sort',
  'description', 'article', 'folder', 'cloud', 'file_copy',
  'attachment', 'link', 'image', 'photo', 'video_library',
  'mail', 'message', 'chat', 'notifications', 'phone',
  'email', 'contact_mail', 'contacts', 'share', 'send',
  'shopping_cart', 'store', 'attach_money', 'account_balance',
  'receipt', 'payment', 'credit_card', 'local_shipping',
  'account_circle', 'person', 'people', 'group', 'person_add',
  'admin_panel_settings', 'security', 'lock', 'vpn_key',
  'palette', 'style', 'format_paint', 'brush', 'color_lens',
  'straighten', 'category', 'layers', 'view_module',
  'info', 'help', 'warning', 'error', 'check_circle',
  'done', 'star', 'favorite', 'bookmark', 'flag',
  'bar_chart', 'pie_chart', 'timeline', 'trending_up',
  'data_usage', 'assessment', 'analytics', 'show_chart',
  'computer', 'devices', 'phone_android', 'tablet_android',
  'wifi', 'bluetooth', 'storage', 'sd_storage'
]

onMounted(async () => {
  try {
    menuItems.value = await menuService.getMenuItems();
  } catch (error) {
    $q.notify({
      message: 'Error al cargar el menú',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
  expanded.value;
})

const addMenuItem = () => {
  if (!dialog.value.label.trim()) return
  if (!dialog.value.icon) {
    dialog.value.iconError = true
    return
  }

  const newItem: MenuNode = {
    path: '/' + dialog.value.label.toLowerCase().replace(/\s+/g, '-'),
    label: dialog.value.label,
    icon: dialog.value.icon,
    children: []
  }

  if (dialog.value.parentNode) {
    dialog.value.parentNode.children?.push(newItem)
    // Expand parent node
    expanded.value = [...expanded.value, dialog.value.parentNode.path]
  } else {
    menuItems.value.push(newItem)
  }

  dialog.value.show = false
  dialog.value.label = ''
  dialog.value.icon = ''
  dialog.value.iconError = false
  dialog.value.parentNode = null
}

const openAddDialog = (parentNode: MenuNode | null = null) => {
  dialog.value = {
    show: true,
    label: '',
    icon: '',
    isEdit: false,
    parentNode,
    currentNode: null,
    iconError: false
  }
}

const editMenuItem = (item: MenuNode) => {
  dialog.value = {
    show: true,
    label: item.label,
    icon: item.icon,
    isEdit: true,
    parentNode: null,
    currentNode: item,
    iconError: false
  }
}

const saveEdit = () => {
  if (!dialog.value.currentNode || !dialog.value.label.trim()) return
  if (!dialog.value.icon) {
    dialog.value.iconError = true
    return
  }

  const node = dialog.value.currentNode
  node.label = dialog.value.label
  node.icon = dialog.value.icon
  node.path = '/' + dialog.value.label.toLowerCase().replace(/\s+/g, '-')

  dialog.value.show = false
  dialog.value.label = ''
  dialog.value.icon = ''
  dialog.value.iconError = false
  dialog.value.currentNode = null
}

const deleteMenuItem = (item: MenuNode, parentNode: MenuNode | null = null) => {
  if (parentNode) {
    const index = parentNode.children?.findIndex(node => node.path === item.path) ?? -1
    if (index !== -1) {
      parentNode.children?.splice(index, 1)
    }
  } else {
    const index = menuItems.value.findIndex(node => node.path === item.path)
    if (index !== -1) {
      menuItems.value.splice(index, 1)
    }
  }
}

const saveChanges = async () => {
  try {
    await menuService.saveMenuRol(-1,menuItems.value)
    $q.notify({
      color: 'positive',
      message: 'Talla guardada exitosamente',
      icon: 'check',
      position: 'center'
    });
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: `Error al guardar la talla: ${error.message}`,
      icon: 'error',
      position: 'center'
    });
  }
}

const updateExpanded = (path: string, isExpanded: boolean) => {
  if (isExpanded) {
    expanded.value.push(path)
  } else {
    expanded.value = expanded.value.filter(p => p !== path)
  }
}
</script>

<template>
  <div class="q-pa-md menu-container">
    <div class="row items-center q-mb-md">
      <h5 class="q-my-none">Menú de Opciones</h5>
      <q-space />
      <q-btn
        color="primary"
        icon="add"
        label="Agregar"
        @click="openAddDialog()"
        class="q-mr-sm"
        :disable="loading"
      />
      
    </div>

    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" size="3em" />
      <div class="text-grey q-mt-sm">Cargando menú...</div>
    </div>

    <q-list v-else bordered>
      <template v-for="item in menuItems" :key="item.path">
        <q-expansion-item
          :model-value="expanded.includes(item.path)"
          expand-separator
          @update:model-value="val => updateExpanded(item.path, val)"
          header-class="menu-item"
        >
          <template #header>
            <div class="row items-center full-width q-py-sm">
              <q-icon :name="item.icon" color="primary" size="md" class="q-mr-md" />
              <div class="col">
                <div>{{ item.label }}</div>
                <div class="text-caption text-grey">{{ item.path }}</div>
              </div>
              <div class="row items-center">
                <q-btn
                  flat
                  round
                  color="positive"
                  icon="add_circle"
                  size="sm"
                  @click.stop="openAddDialog(item)"
                  class="q-mr-sm"
                />
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  size="sm"
                  @click.stop="editMenuItem(item)"
                  class="q-mr-sm"
                />
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  size="sm"
                  @click.stop="deleteMenuItem(item)"
                />
              </div>
            </div>
          </template>

          <div class="q-pl-lg">
            <template v-for="child in item.children" :key="child.path">
              <q-expansion-item
                :model-value="expanded.includes(child.path)"
                expand-separator
                @update:model-value="val => updateExpanded(child.path, val)"
                header-class="menu-item"
              >
                <template #header>
                  <div class="row items-center full-width q-py-sm">
                    <q-icon :name="child.icon" color="primary" size="md" class="q-mr-md" />
                    <div class="col">
                      <div>{{ child.label }}</div>
                      <div class="text-caption text-grey">{{ child.path }}</div>
                    </div>
                    <div class="row items-center">
                      <q-btn
                        flat
                        round
                        color="positive"
                        icon="add_circle"
                        size="sm"
                        @click.stop="openAddDialog(child)"
                        class="q-mr-sm"
                      />
                      <q-btn
                        flat
                        round
                        color="primary"
                        icon="edit"
                        size="sm"
                        @click.stop="editMenuItem(child)"
                        class="q-mr-sm"
                      />
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        size="sm"
                        @click.stop="deleteMenuItem(child, item)"
                      />
                    </div>
                  </div>
                </template>

                <div class="q-pl-lg">
                  <template v-for="grandChild in child.children" :key="grandChild.path">
                    <div class="row items-center full-width q-py-sm q-px-md">
                      <q-icon :name="grandChild.icon" color="primary" size="md" class="q-mr-md" />
                      <div class="col">
                        <div>{{ grandChild.label }}</div>
                        <div class="text-caption text-grey">{{ grandChild.path }}</div>
                      </div>
                      <div class="row items-center">
                        <q-btn
                          flat
                          round
                          color="primary"
                          icon="edit"
                          size="sm"
                          @click.stop="editMenuItem(grandChild)"
                          class="q-mr-sm"
                        />
                        <q-btn
                          flat
                          round
                          color="negative"
                          icon="delete"
                          size="sm"
                          @click.stop="deleteMenuItem(grandChild, child)"
                        />
                      </div>
                    </div>
                  </template>
                </div>
              </q-expansion-item>
            </template>
          </div>
        </q-expansion-item>
      </template>
     
    </q-list>
    
    <q-dialog v-model="dialog.show" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            {{ dialog.isEdit ? 'Editar' : 'Agregar' }} 
            {{ dialog.parentNode ? 'Submenú' : 'Menú' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="dialog.label"
            label="Nombre del menú"
            dense
            class="q-mb-md"
          />

          <div class="text-subtitle2 q-mb-sm">Seleccionar icono:</div>
          <div class="row q-gutter-sm">
            <q-btn
              v-for="icon in materialIcons"
              :key="icon"
              :icon="icon"
              :color="dialog.icon === icon ? 'primary' : 'grey-7'"
              round
              flat
              @click="dialog.icon = icon"
            />
          </div>
          <div v-if="dialog.iconError" class="text-negative q-mt-sm">
            Seleccione un icono
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Guardar"
            color="primary"
            @click="dialog.isEdit ? saveEdit() : addMenuItem()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="flex justify-end">
      <div class="q-pt-md">
        <q-btn
            color="positive"
            icon="save"
            label="Guardar Cambios"
            @click="saveChanges"
            :disable="loading"
          />   
      </div>
    </div>
    
  </div>
</template>

<style scoped>
.menu-container {
  max-width: 700px;
}

.menu-item {
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.q-expansion-item :deep(.q-expansion-item__container) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.q-expansion-item :deep(.q-expansion-item__container:last-child) {
  border-bottom: none;
}
</style>