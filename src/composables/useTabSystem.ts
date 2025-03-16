import { ref } from 'vue';
import type { Ref } from 'vue';

export interface Tab {
  path: string;
  label: string;
  icon: string;
}

export function useTabSystem() {
  const openTabs: Ref<Tab[]> = ref([
    { path: '/', label: 'INICIO', icon: 'home' }
  ]);
  const currentTab: Ref<string> = ref('/');

  function openTab(tab: Tab) {
    const exists = openTabs.value.find(t => t.path === tab.path);
    if (!exists) {
      openTabs.value.push(tab);
    }
    currentTab.value = tab.path;
  }

  function closeTab(path: string) {
    const index = openTabs.value.findIndex(tab => tab.path === path);
    if (index > 0) {
      openTabs.value.splice(index, 1);
      if (currentTab.value === path) {
        const newPath = openTabs.value[openTabs.value.length - 1].path;
        currentTab.value = newPath;
        return newPath;
      }
    }
    return null;
  }

  function closeAllTabs() {
    openTabs.value = [openTabs.value[0]];
    currentTab.value = '/';
  }

  return {
    openTabs,
    currentTab,
    openTab,
    closeTab,
    closeAllTabs
  };
}

export type TabSystem = ReturnType<typeof useTabSystem>;

export const TabSystemKey = Symbol('TabSystem');