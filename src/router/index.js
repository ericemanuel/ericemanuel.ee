import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import home from '../views/home.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: home,
  },
  {
    path: '/one',
    name: 'one',
    component: () => import('../views/one.vue'),
  },
  {
    path: '/soul',
    name: 'soul',
    component: () => import('../views/soul.vue'),
  },
  {
    path: '/sesc',
    name: 'sesc',
    component: () => import('../views/sesc.vue'),
  },
  {
    path: '/gamechanger',
    name: 'gamechanger',
    component: () => import('../views/gamechanger.vue'),
  },
  {
    path: '/ericemanuel',
    name: 'ericemanuel',
    component: () => import('../views/ericemanuel.vue'),
  },
  {
    path: '/sescgo',
    name: 'sescgo',
    component: () => import('../views/sescgo.vue'),
  },
  {
    path: '/danei/privacy',
    name: 'danei-privacy',
    component: () => import('../views/danei/privacy.vue'),
  },
  {
    path: '/danei/support',
    name: 'danei-support',
    component: () => import('../views/danei/support.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
      behavior: 'smooth',
    };
  },
});

export default router;