import { boot } from 'quasar/wrappers';
import { useQuasar } from 'quasar';

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export const themes: Theme[] = [
  {
    name: 'Tecnológico',
    primary: '3498db',
    secondary: '1abc9c',
    accent: 'e8f6f3'
  },
  {
    name: 'Corporativo',
    primary: '1A237E',
    secondary: 'E8EAF6',
    accent: 'FF7043'
  },
  {
    name: 'Profesional',
    primary: '424242',
    secondary: 'BBDEFB',
    accent: '2E7D32'
  },
  {
    name: 'Mandarina',
    primary: 'FF8C42',
    secondary: '37474F',
    accent: 'A5D6A7'
  },
  {
    name: 'Cielo',
    primary: '64B5F6',
    secondary: 'ECEFF1',
    accent: 'F9A825'
  },
  {
    name: 'Oliva',
    primary: '8D6E63',
    secondary: 'E0E0E0',
    accent: 'FF7043'
  },
  {
    name: 'Marino',
    primary: '0D47A1',
    secondary: 'C8E6C9',
    accent: 'FF5722'
  },
  {
    name: 'Caoba',
    primary: '3E2723',
    secondary: 'F5F5F5',
    accent: 'AED581'
  },
  {
    name: 'Nocturno',
    primary: '263238',
    secondary: 'FF8F00',
    accent: 'B3E5FC'
  },
  {
    name: 'Profundo',
    primary: '0D47A1',
    secondary: 'CFD8DC',
    accent: '66BB6A'
  }
];

export default boot(({ app }) => {
  const $q = useQuasar();
  
  const setTheme = (theme: Theme) => {
    document.documentElement.style.setProperty('--q-primary', `#${theme.primary}`);
    document.documentElement.style.setProperty('--q-secondary', `#${theme.secondary}`);
    document.documentElement.style.setProperty('--q-accent', `#${theme.accent}`);
  };

  // Set default theme
  setTheme(themes[0]);

  // Make theme utilities available globally
  app.config.globalProperties.$themes = themes;
  app.config.globalProperties.$setTheme = setTheme;
});

export const useTheme = () => {
  const $q = useQuasar();
  
  const setTheme = (theme: Theme) => {
    document.documentElement.style.setProperty('--q-primary', `#${theme.primary}`);
    document.documentElement.style.setProperty('--q-secondary', `#${theme.secondary}`);
    document.documentElement.style.setProperty('--q-accent', `#${theme.accent}`);
  };

  return {
    themes,
    setTheme
  };
};