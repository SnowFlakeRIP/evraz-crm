/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: setupLayouts,
  routes: [
    {
      path:      '/',
      component: () => import('../layouts/default.vue'),
      children:  [
        {
          path:      'default',
          name:      'index',
          component: () => import('../pages/index.vue'),
        },
        {
          path:      'page1',
          name:      'page1',
          component: () => import('../pages/pageReferalProgramm.vue'),
        },
        {
          path:      'page2',
          name:      'page2',
          component: () => import('../pages/pageMyBonusSestema.vue'),
        },
      ],
    },
  ],
})

export default router
