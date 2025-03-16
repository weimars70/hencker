import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Tab {
  path: string;
  label: string;
  icon: string;
}

export const useTabStore = defineStore('tab', () => {
  const tabs = ref<Tab[]>([
    { path: '/', label: 'INICIO', icon: 'home' }
  ]);
  
  const currentTab = ref('/');

  const addTab = (tab: Tab) => {
    if (!tabs.value.find(t => t.path === tab.path)) {
      tabs.value.push(tab);
    }
    currentTab.value = tab.path;
  };

  const removeTab = (path: string) => {
    const index = tabs.value.findIndex(tab => tab.path === path);
    if (index > 0) {
      tabs.value.splice(index, 1);
      if (currentTab.value === path) {
        currentTab.value = tabs.value[tabs.value.length - 1].path;
      }
    }
  };

  const closeAllTabs = () => {
    tabs.value = [tabs.value[0]];
    currentTab.value = '/';
  };

  return {
    tabs,
    currentTab,
    addTab,
    removeTab,
    closeAllTabs
  };
});