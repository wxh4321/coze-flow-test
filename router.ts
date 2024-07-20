import type { RouterOptions } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

export const routes: RouterOptions['routes'] = [
  {
    path: '/',
    redirect: '/work_flow',
  },
  {
    path:'/work_flow',
    name:'work_flow',
    component: () => import('./src/WorkFlow/WorkFlow.vue'),
    meta: {
      title: '工作流'
    }
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
