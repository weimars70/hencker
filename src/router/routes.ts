import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../pages/IndexPage.vue')
      },
      {
        path: 'colors',
        name: 'colors',
        component: () => import('../features/colors/pages/ColorPage.vue')
      },
      {
        path: 'sizes',
        name: 'sizes',
        component: () => import('../features/sizes/pages/SizePage.vue')
      },
      {
        path: 'item-groups',
        name: 'item-groups',
        component: () => import('../features/groups/pages/GroupPage.vue')
      },
      {
        path: 'purchases',
        name: 'purchases',
        component: () => import('../pages/Purchases.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('../features/roles/pages/RolePage.vue')
      },
      {
        path: 'roles-permisos',
        name: 'roles-permisos',
        component: () => import('../pages/RolesPermisos.vue')
      },
      {
        path: 'permisos',
        name: 'permisos',
        component: () => import('../pages/Permisos.vue')
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('../features/users/pages/UserPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
];

export default routes;