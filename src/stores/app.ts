import { defineStore } from 'pinia';

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
}

interface AppState {
  darkMode: boolean;
  currentTheme: Theme;
  currentLanguage: string;
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    darkMode: false,
    currentTheme: {
      primary: '#069e8c',
      secondary: '#26a69a',
      accent: '#9c27b0'
    },
    currentLanguage: 'es'
  }),
  
  actions: {
    setDarkMode(value: boolean) {
      this.darkMode = value;
    },
    setTheme(theme: Theme) {
      this.currentTheme = theme;
    },
    setLocale(lang: string) {
      this.currentLanguage = lang;
    }
  },
  
  persist: {
    key: 'app-store',
    paths: ['darkMode', 'currentTheme', 'currentLanguage']
  }
});