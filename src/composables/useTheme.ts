import { ref } from 'vue';
import { useQuasar } from 'quasar';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}
export const themes: Theme[] = [
  {
    name: 'Tecnológico',
    primary: '3498db',
    secondary: '1abc9c',
    accent: 'e8f6f3',
    background: 'FFFFFF'
  },
  {
    name: 'Azul Marino',
    primary: '1A237E',
    secondary: 'FF7043',
    accent: 'E8EAF6',
    background: 'FFFFFF'
  },
  {
    name: 'Ejecutivo Oscuro',
    primary: '424242',
    secondary: 'BBDEFB',
    accent: '2E7D32',
    background: 'FFFFFF'
  },
  {
    name: 'Corporativo Índigo',
    primary: '0D47A1',
    secondary: 'CFD8DC',
    accent: '66BB6A',
    background: 'FFFFFF'
  },
  {
    name: 'Elegante Gris',
    primary: '37474F',
    secondary: '90A4AE',
    accent: 'FF8F00',
    background: 'FFFFFF'
  },
  {
    name: 'Moderno Verde',
    primary: '2E7D32',
    secondary: 'FDD835',
    accent: 'F1F8E9',
    background: 'FFFFFF'
  },
  {
    name: 'Púrpura Real',
    primary: '4A148C',
    secondary: '00BCD4',
    accent: 'F3E5F5',
    background: 'FFFFFF'
  },
  {
    name: 'Empresarial Rojo',
    primary: 'B71C1C',
    secondary: '455A64',
    accent: 'FFEBEE',
    background: 'FFFFFF'
  },
  {
    name: 'Verde Esmeralda',
    primary: '00695C',
    secondary: 'FF6F00',
    accent: 'E0F2F1',
    background: 'FFFFFF'
  },
  {
    name: 'Azul Noche',
    primary: '1A237E',
    secondary: '00BFA5',
    accent: 'E8EAF6',
    background: 'FFFFFF'
  },
  {
    name: 'Dorado Premium',
    primary: 'FF6F00',
    secondary: '37474F',
    accent: 'FFF8E1',
    background: 'FFFFFF'
  },
  {
    name: 'Verde Bosque',
    primary: '1B5E20',
    secondary: 'FFA000',
    accent: 'E8F5E9',
    background: 'FFFFFF'
  }
];

export function useTheme() {
  const $q = useQuasar();
  const currentTheme = ref(themes[0]);

  function setTheme(theme: Theme) {
    if (!theme) return;
    
    currentTheme.value = theme;
    
    // Update CSS variables
    document.documentElement.style.setProperty('--q-primary', `#${theme.primary}`);
    document.documentElement.style.setProperty('--q-secondary', `#${theme.secondary}`);
    document.documentElement.style.setProperty('--q-accent', `#${theme.accent}`);
    document.documentElement.style.setProperty('--q-background', `#${theme.background}`);
    
    // Update body background
    document.body.style.backgroundColor = `#${theme.background}`;
    
    // Update Quasar dark mode based on background color
    const isDark = theme.background === '212121' || theme.background === '37474F';
    if ($q && typeof $q.dark?.set === 'function') {
      $q.dark.set(isDark);
    }

    // Update Quasar brand colors if available
    if ($q && typeof $q.brand?.set === 'function') {
      $q.brand.set({
        primary: theme.primary,
        secondary: theme.secondary,
        accent: theme.accent
      });
    }
  }

  return {
    currentTheme,
    themes,
    setTheme
  };
}