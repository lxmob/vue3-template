import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import(/* webpackChunkName: "Home" */ '../pages/home') },
  { path: '/about', component: () => import(/* webpackChunkName: "About" */ '../pages/about') }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
