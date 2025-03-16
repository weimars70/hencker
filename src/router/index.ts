import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useTabStore } from '../stores/tab';
import { ref } from 'vue';

const openTabs = ref([
  { path: '/', label: 'INICIO', icon: 'home' }
]);
const currentTab = ref('/');

const router = createRouter({
  history: createMemoryHistory(),
  routes
});




router.beforeEach((to, from, next) => {
  const tabStore = useTabStore();
  
  // If route exists and it's not already in tabs, add it
  if (to.name && to.path !== from.path) {

            
    /*let rutapath = to.path.substring(1);
    
    const matchedRoute = routes[1].children?.find(route => route.path === rutapath);
    
    if (!matchedRoute) {
      console.log('matchedRoute:  ', to.path);
      tabStore.addTab({
        path: rutapath,
        label: to.path?.toString().toUpperCase() || '',
        icon: getIconForRoute(rutapath)
      });
    }*/
  }
  
  next();
});

function getIconForRoute(path: string): string {
  const icons: Record<string, string> = {
    '/': 'home',
    '/colors': 'palette',
    '/sizes': 'straighten',
    '/item-groups': 'category',
    '/purchases': 'shopping_cart',
    '/roles': 'admin_panel_settings',
    '/permisos': 'shopping_cart',
    '/usuarios': 'users',
  };
  
  return icons[path] || 'help';
}

export default router;



