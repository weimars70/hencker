<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="themed-header">
      <q-toolbar class="q-px-lg">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        
        <q-toolbar-title class="text-weight-bold">
          Sistema ERP
        </q-toolbar-title>

        <q-select
          v-model="selectedBranch"
          :options="branches"
          dense
          outlined
          class="branch-select q-mr-md"
          label="Sucursal"
          bg-color="white"
        />

        <q-btn-dropdown
          flat
          dense
          :label="currentTheme.name"
          class="q-mr-md text-white"
        >
          <q-list style="min-width: 200px">
            <q-item
              v-for="theme in themes"
              :key="theme.name"
              clickable
              v-close-popup
              @click="setTheme(theme)"
              class="q-py-md"
            >
              <q-item-section avatar>
                <div class="theme-preview">
                  <div class="color-strip" :style="{ background: `#${theme.primary}` }"></div>
                  <div class="color-strip" :style="{ background: `#${theme.secondary}` }"></div>
                  <div class="color-strip" :style="{ background: `#${theme.accent}` }"></div>
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ theme.name }}</q-item-label>
                <q-item-label caption>
                  <span class="text-primary">#{{ theme.primary }}</span> • 
                  <span class="text-secondary">#{{ theme.secondary }}</span> • 
                  <span class="text-grey">#{{ theme.accent }}</span>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn
          flat
          dense
          :icon="isDark ? 'light_mode' : 'dark_mode'"
          @click="toggleDarkMode"
          class="q-mr-md"
        />

        <q-btn-dropdown flat dense class="q-mr-md text-white" label="ESPAÑOL">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>Español</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>English</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn-dropdown flat dense>
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-avatar size="28px" class="q-mr-xs">
                <img src="https://cdn.quasar.dev/img/avatar.png" />
              </q-avatar>
              <div class="text-white">{{ auth.user?.name || 'ADMIN' }}</div>
              <q-icon name="arrow_drop_down" />
            </div>
          </template>

          <q-list>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section>Cerrar Sesión</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="drawer-custom themed-drawer"
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-weight-bold text-primary q-pb-md">
            MENÚ
          </q-item-label>

          <q-tree
            :nodes="menuItems"
            node-key="path"
            default-expand-all
            no-connectors
            @click.native.stop
          >
            <template v-slot:default-header="prop">
              <div 
                class="row items-center full-width cursor-pointer"
                @click="openInTab(prop.node)"
              >
                <q-icon :name="prop.node.icon" size="24px" class="q-mr-sm" />
                <div class="text-weight-medium">{{ prop.node.label }}</div>
              </div>
            </template>
          </q-tree>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="q-pb-xl">
      <router-view />
    </q-page-container>

    <q-footer elevated class="themed-footer">
      <div class="row items-center q-px-md q-py-sm">
        <q-tabs
          v-model="currentTab"
          dense
          class="col"
          active-color="white"
          indicator-color="transparent"
          align="left"
        >
          <q-tab
            v-for="tab in tabs"
            :key="tab.path"
            :name="tab.path"
            :class="['tab-button themed-tab', { 'active': currentTab === tab.path }]"
            @click="router.push(tab.path)"
          >
            <div class="row items-center no-wrap q-gutter-x-xs">
              <q-icon :name="tab.icon" size="14px" />
              <div class="tab-label text-caption text-weight-medium">{{ tab.label }}</div>
              <q-btn
                v-if="tab.path !== '/'"
                flat
                dense
                round
                icon="close"
                size="xs"
                class="close-btn"
                @click.stop="closeTab(tab.path)"
              />
            </div>
          </q-tab>
        </q-tabs>

        <q-btn
          flat
          dense
          icon="close"
          label="CERRAR TODO"
          class="close-all-btn themed-tab"
          size="sm"
          @click="closeAllTabs"
          :disable="tabs.length <= 1"
        />
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, provide, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/auth';
import { menuService } from 'src/services/menuServices';
import { MenuNode } from 'src/types/menu';
import { useTheme } from '../composables/useTheme';

const menuItems = ref<MenuNode[]>([]);
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const $q = useQuasar();

const { currentTheme, themes, setTheme } = useTheme();

const leftDrawerOpen = ref(false);
const currentTab = ref('/');
const tabs = ref([
  { path: '/', label: 'INICIO', icon: 'home' }
]);

const branches = [
  { label: 'Principal', value: 'main' },
  { label: 'Sucursal 1', value: 'branch1' },
  { label: 'Sucursal 2', value: 'branch2' }
];

const selectedBranch = ref(branches[0].value);

const isDark = computed({
  get: () => $q.dark.isActive,
  set: (value) => $q.dark.set(value)
});

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleDarkMode() {
  isDark.value = !isDark.value;
}

function logout() {
  auth.logout();
  router.push('/login');
}

function openInTab(node: MenuNode) {
  if (node.path) {
    const path = node.path === '/inicio' ? '/' : node.path;
    const exists = tabs.value.find(t => t.path === path);
    if (!exists) {
      tabs.value.push({
        path,
        label: node.label.toUpperCase(),
        icon: node.icon
      });
    }
    currentTab.value = path;
    router.push(path);
  }
}

// Provide the openInTab function to child components
provide('openTab', openInTab);

function closeTab(path: string) {
  const index = tabs.value.findIndex(tab => tab.path === path);
  if (index > 0) {
    tabs.value.splice(index, 1);
    if (currentTab.value === path) {
      const newPath = tabs.value[tabs.value.length - 1].path;
      currentTab.value = newPath;
      router.push(newPath);
    }
  }
}

function closeAllTabs() {
  tabs.value = [tabs.value[0]];
  currentTab.value = '/';
  router.push('/');
}

onMounted(async () => {
  menuItems.value = await menuService.getMenuItems();
  setTheme(themes[0]);
  if (!auth.isAuthenticated) {
    router.push('/login');
  }
});
</script>

<style lang="scss" scoped>
.branch-select {
  width: 200px;
  background: white;
  border-radius: 4px;
  
  :deep(.q-field__control) {
    height: 32px;
  }
}

.theme-preview {
  display: flex;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  .color-strip {
    flex: 1;
    height: 100%;
  }
}

.q-toolbar {
  height: 64px;
}

.drawer-custom {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);

  .q-item {
    border-radius: 8px;
    margin: 4px 8px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(25, 118, 210, 0.1);
    }

    .q-icon {
      color: #1976D2;
    }
  }

  .q-tree__node-header {
    padding: 4px 8px;
    border-radius: 8px;
    margin: 2px 0;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(25, 118, 210, 0.1);
    }

    .q-icon {
      color: #1976D2;
    }
  }

  .q-item-label {
    font-size: 0.9rem;
    padding: 16px;
    color: #1976D2;
  }
}

.tab-button {
  min-height: 32px;
  padding: 0 12px;
  margin: 0 2px;
  border-radius: 8px;
  font-size: 11px;
  opacity: 0.7;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &.active {
    opacity: 1;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    .tab-label {
      color: white;
    }

    .q-icon {
      color: white;
    }
  }

  .tab-label {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: white;
  }

  .q-icon {
    color: white;
  }

  .close-btn {
    opacity: 0.7;
    transition: opacity 0.2s ease;
    color: white;
    
    .q-icon {
      font-size: 12px;
    }

    &:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }
  }

  &:hover {
    opacity: 0.9;
    .close-btn {
      opacity: 1;
    }
  }
}

.close-all-btn {
  font-size: 11px;
  height: 32px;
  border-radius: 8px;
  color: white;
  opacity: 0.8;
  font-weight: 500;
  padding: 0 12px;

  &:hover:not(:disabled) {
    opacity: 1;
  }

  &:disabled {
    opacity: 0.5;
  }
}

.body--dark {
  .drawer-custom {
    background: linear-gradient(135deg, #1A237E 0%, #0D47A1 100%);

    .q-item {
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .q-icon {
        color: #90CAF9;
      }
    }

    .q-tree__node-header {
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .q-icon {
        color: #90CAF9;
      }
    }

    .q-item-label {
      color: #90CAF9;
    }
  }

  .theme-preview {
    border-color: rgba(255, 255, 255, 0.2);
  }
}
</style>