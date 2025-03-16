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
    const existingTab = tabs.value.find(t => t.path === tab.path);
    if (!existingTab) {
      tabs.value.push(tab);
    }
    currentTab.value = tab.path;
    return !existingTab; // Return true if a new tab was added
  };

  const removeTab = (path: string) => {
    const index = tabs.value.findIndex(tab => tab.path === path);
    if (index > 0) {
      tabs.value.splice(index, 1);
      if (currentTab.value === path) {
        currentTab.value = tabs.value[tabs.value.length - 1].path;
        return tabs.value[tabs.value.length - 1].path;
      }
    }
    return null;
  };

  const closeAllTabs = () => {
    tabs.value = [tabs.value[0]];
    currentTab.value = '/';
  };

  const setCurrentTab = (path: string) => {
    currentTab.value = path;
  };

  return {
    tabs,
    currentTab,
    addTab,
    removeTab,
    closeAllTabs,
    setCurrentTab
  };
});