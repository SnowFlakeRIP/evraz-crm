/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
// import { setupLayouts } from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // extendRoutes: setupLayouts,
  routes: [
    {
      path: '/',
      component: () => import('../layouts/default.vue'),
      children: [
        {
          path: '',
          name: 'courses',
          component: () => import('../pages/index.vue'),
        },
        {
          path: 'createCourse',
          name: 'page1',
          component: () => import('../pages/createCourse.vue'),
        },
        {
          path: 'course',
          name: 'page1',
          component: () => import('../pages/createCourse.vue'),
        }
      ]
    }
]
})

export default router
