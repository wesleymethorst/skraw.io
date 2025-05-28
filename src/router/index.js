import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Game from '../pages/Game.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Skraw - Home'
    }
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
    meta: {
      title: 'Skraw - Game Room'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard to change the title
router.beforeEach((to, from, next) => {
  // Set default title or get from meta
  document.title = to.meta.title || 'Skraw - Free multiplayer sketching, drawing & guessing game'
  next()
})

export default router 