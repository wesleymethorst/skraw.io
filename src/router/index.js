import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Game from '../pages/Game.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Skraw.io - Free multiplayer sketching, drawing & guessing game'
    }
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
    meta: {
      title: 'Skraw.io - Game Room'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Skraw.io - Free multiplayer sketching, drawing & guessing game'
  next()
})

export default router 