/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {
  createRouter,
  createWebHistory,
} from 'vue-router/auto';
// import { setupLayouts } from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // extendRoutes: setupLayouts,
  routes: [
    {
      path:      '/',
      component: () => import('../layouts/default.vue'),

    },
  ],
});

export default router;
