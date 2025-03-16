import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export interface Tab {
  path: string;
  label: string;
  icon: string;
}

export function useNavigation() {
  const router = useRouter();
  const currentTab = ref('/');
  const openTabs = ref<Tab[]>([
    { path: '/', label: 'INICIO', icon: 'home' }
  ]);

  const menuItems = [
    { path: '/', label: 'Inicio', icon: 'home' },
    { path: '/colors', label: 'Colores', icon: 'palette' },
    { path: '/sizes', label: 'Tallas', icon: 'straighten' },
    { path: '/item-groups', label: 'Grupos', icon: 'category' },
    { path: '/purchases', label: 'Compras', icon: 'shopping_cart' }
  ];

  function openTab(item: Tab) {
    const exists = openTabs.value.find(t => t.path === item.path);
    if (!exists) {
      openTabs.value.push({
        path: item.path,
        label: item.label.toUpperCase(),
        icon: item.icon
      });
    }
    currentTab.value = item.path;
    router.push(item.path);
  }

  function closeTab(path: string) {
    const index = openTabs.value.findIndex(tab => tab.path === path);
    if (index > 0) {
      openTabs.value.splice(index, 1);
      if (currentTab.value === path) {
        const newPath = openTabs.value[openTabs.value.length - 1].path;
        currentTab.value = newPath;
        router.push(newPath);
      }
    }
  }

  function closeAllTabs() {
    openTabs.value = [openTabs.value[0]];
    currentTab.value = '/';
    router.push('/');
  }

  return {
    currentTab,
    openTabs,
    menuItems,
    openTab,
    closeTab,
    closeAllTabs
  };
}